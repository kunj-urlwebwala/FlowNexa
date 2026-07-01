import { prisma } from "../../config/database";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError";
import { OrderStatus, PaymentStatus, ReturnStatus, StockTransactionType } from "@prisma/client";
import { addInvoiceEmailJob, addVerificationCallJob } from "../../jobs/queue";
import { logger } from "../../config/logger";

export class OrdersService {
  /**
   * Create customer order
   */
  async createOrder(userId: string, data: any) {
    const orderNumber = `FN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Verify user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundError("Customer profile not found");
    }

    // Run order placement in a single Transaction to guarantee atomicity and stock security
    const order = await prisma.$transaction(async (tx) => {
      // 1. Check & deduct inventory stock for each item
      for (const item of data.items) {
        // Find default warehouse to deduct from (in a real system, would be routed based on region/proximity)
        const defaultWarehouse = await tx.warehouse.findFirst();
        if (!defaultWarehouse) {
          throw new ConflictError("No distribution center warehouses configured");
        }

        const stock = await tx.inventoryStock.findFirst({
          where: {
            warehouseId: defaultWarehouse.id,
            productId: item.productId,
            variantId: item.variantId || undefined,
          },
        });

        if (!stock || stock.quantity < item.quantity) {
          throw new ConflictError(`Insufficient stock for product SKU: ${item.sku}`);
        }

        // Deduct stock
        await tx.inventoryStock.update({
          where: { id: stock.id },
          data: { quantity: { decrement: item.quantity } },
        });

        // Add ledger record
        await tx.stockLedger.create({
          data: {
            warehouseId: defaultWarehouse.id,
            productId: item.productId,
            variantId: item.variantId || null,
            type: StockTransactionType.SALE,
            quantity: -item.quantity,
            note: `Order sale deduction: ${orderNumber}`,
          },
        });
      }

      // 2. Create the Order
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod: data.paymentMethod,
          shippingAddress: data.shippingAddress,
          billingAddress: data.billingAddress,
          subtotal: data.subtotal,
          tax: data.tax,
          shippingCharges: data.shippingCharges,
          discount: data.discount,
          total: data.total,
          couponCode: data.couponCode,
          items: {
            create: data.items.map((item: any) => ({
              productId: item.productId,
              variantId: item.variantId || null,
              productName: item.productName,
              sku: item.sku,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return createdOrder;
    });

    // Schedule AI verification pipeline (fire-and-forget, don't block order response)
    try {
      // 1. Send invoice email immediately
      await addInvoiceEmailJob(order.id);

      // 2. Schedule AI verification call after 5 minutes (300,000ms)
      await addVerificationCallJob(order.id, 1, 5 * 60 * 1000);

      logger.info({ orderId: order.id, orderNumber: order.orderNumber }, "AI verification pipeline scheduled");
    } catch (pipelineError) {
      // Don't fail the order creation if pipeline scheduling fails
      logger.error({ error: pipelineError, orderId: order.id }, "Failed to schedule verification pipeline (non-critical)");
    }

    return order;
  }

  /**
   * List orders with query params
   */
  async listOrders(filters: {
    page: number;
    limit: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    search?: string;
  }) {
    const { page, limit, status, paymentStatus, search } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          items: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: true,
        returns: true,
        refunds: true,
      },
    });

    if (!order) {
      throw new NotFoundError("Order details not found");
    }

    return order;
  }

  /**
   * Update order status (with stock restoration if cancelled)
   */
  async updateOrderStatus(id: string, status: OrderStatus, paymentStatus?: PaymentStatus) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Run status modification in transaction
    const updated = await prisma.$transaction(async (tx) => {
      // If moving to CANCELLED from a non-cancelled state, restore inventory stock!
      if (status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
        for (const item of order.items) {
          const defaultWarehouse = await tx.warehouse.findFirst();
          if (defaultWarehouse) {
            const stock = await tx.inventoryStock.findFirst({
              where: {
                warehouseId: defaultWarehouse.id,
                productId: item.productId,
                variantId: item.variantId || null,
              },
            });

            if (stock) {
              await tx.inventoryStock.update({
                where: { id: stock.id },
                data: { quantity: { increment: item.quantity } },
              });

              // Log stock adjustment ledger
              await tx.stockLedger.create({
                data: {
                  warehouseId: defaultWarehouse.id,
                  productId: item.productId,
                  variantId: item.variantId || null,
                  type: StockTransactionType.RETURN,
                  quantity: item.quantity,
                  note: `Order cancellation stock recovery: ${order.orderNumber}`,
                },
              });
            }
          }
        }
      }

      const updatePayload: any = { status };
      if (paymentStatus) {
        updatePayload.paymentStatus = paymentStatus;
      }

      return tx.order.update({
        where: { id },
        data: updatePayload,
        include: { items: true },
      });
    });

    return updated;
  }

  // ----------------------------------------------------
  // RETURNS, REFUNDS & CANCEL REASONS
  // ----------------------------------------------------

  async createReturnRequest(data: any) {
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    const request = await prisma.return.create({
      data: {
        orderId: data.orderId,
        reason: data.reason,
        notes: data.notes,
        status: ReturnStatus.PENDING,
      },
    });

    return request;
  }

  async updateReturnStatus(id: string, status: ReturnStatus) {
    const returnRequest = await prisma.return.findUnique({
      where: { id },
    });

    if (!returnRequest) {
      throw new NotFoundError("Return request not found");
    }

    const updated = await prisma.return.update({
      where: { id },
      data: { status },
    });

    return updated;
  }

  async createRefund(data: any) {
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    const refund = await prisma.refund.create({
      data: {
        orderId: data.orderId,
        amount: data.amount,
        transactionId: data.transactionId,
        reason: data.reason,
        status: PaymentStatus.PAID,
      },
    });

    // Update order payment status
    await prisma.order.update({
      where: { id: data.orderId },
      data: { paymentStatus: PaymentStatus.REFUNDED },
    });

    return refund;
  }

  async listCancelReasons() {
    return prisma.cancelReason.findMany({
      orderBy: { reason: "asc" },
    });
  }

  async createCancelReason(reasonText: string) {
    const existing = await prisma.cancelReason.findUnique({
      where: { reason: reasonText },
    });

    if (existing) {
      throw new ConflictError("Cancellation code reason already exists");
    }

    return prisma.cancelReason.create({
      data: { reason: reasonText },
    });
  }
}
export const ordersService = new OrdersService();
