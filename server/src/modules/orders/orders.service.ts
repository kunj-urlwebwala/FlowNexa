import { prisma } from "../../config/database";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError";
import { OrderStatus, PaymentStatus, ReturnStatus, StockTransactionType } from "@prisma/client";
import { addInvoiceEmailJob, addVerificationCallJob } from "../../jobs/queue";
import { logger } from "../../config/logger";
import { sendMail } from "../../shared/utils/email.util";

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

    // Auto-save/update phone to profile from checkout shipping address
    const shippingPhone = (data.shippingAddress as any)?.phone;
    if (shippingPhone && shippingPhone !== user.phone) {
      await prisma.user.update({
        where: { id: userId },
        data: { phone: shippingPhone },
      });
      logger.info({ userId, oldPhone: user.phone, newPhone: shippingPhone }, "Phone number updated on user profile from checkout");
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

    // Clear user's cart after successful order
    try {
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        logger.info({ userId, orderId: order.id }, "Cart cleared after order placement");
      }
    } catch (cartError) {
      logger.error({ error: cartError, orderId: order.id }, "Failed to clear cart (non-critical)");
    }

    // Schedule AI verification pipeline (fire-and-forget, don't block order response)
    try {
      // 0. Create initial verification call record so it appears in admin dashboard immediately
      await prisma.verificationCall.create({
        data: {
          orderId: order.id,
          status: "SCHEDULED",
          attemptNumber: 1,
        },
      });

      // 1. Send invoice email immediately for all orders
      //    For CARD orders, invoice is also sent on Stripe webhook payment confirmation
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
   * Get orders for the logged-in customer
   */
  async getMyOrders(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          items: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where: { userId } }),
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
   * Get order by ID (with optional ownership check for customers)
   */
  async getOrderById(id: string, requestUserId?: string) {
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

    // If requestUserId is provided (customer request), verify ownership
    if (requestUserId && order.userId !== requestUserId) {
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

    // Send status update email (fire-and-forget)
    try {
      const user = await prisma.user.findUnique({
        where: { id: order.userId },
        select: { email: true, name: true },
      });

      if (user?.email) {
        const statusLabels: Record<string, string> = {
          PROCESSING: "is being processed",
          SHIPPED: "has been shipped",
          DELIVERED: "has been delivered",
          CANCELLED: "has been cancelled",
        };

        const statusLabel = statusLabels[status] || `status updated to ${status}`;

        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #84cc16;">Order ${statusLabel}</h2>
            <p>Hi ${user.name},</p>
            <p>Your order <strong>${order.orderNumber}</strong> ${statusLabel}.</p>
            <p><strong>Order Total: ₹${order.total.toFixed(2)}</strong></p>
            ${status === "SHIPPED" ? `<p>Your order is on its way! You will receive tracking details soon.</p>` : ""}
            ${status === "DELIVERED" ? `<p>We hope you enjoy your purchase! Thank you for shopping with FlowNexa.</p>` : ""}
            ${status === "CANCELLED" ? `<p>If you have any questions, please contact our support team.</p>` : ""}
            <br/>
            <p>Best regards,<br/>FlowNexa Team</p>
          </div>
        `;

        await sendMail(user.email, `Order ${order.orderNumber} ${statusLabel}`, html);
      }
    } catch (emailError) {
      // Non-critical - don't fail the status update
      logger.error({ error: emailError, orderId: order.id }, "Failed to send order status email");
    }

    return updated;
  }

  // ----------------------------------------------------
  // RETURNS, REFUNDS & CANCEL REASONS
  // ----------------------------------------------------

  async listReturns(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [returns, total] = await Promise.all([
      prisma.return.findMany({
        skip,
        take: limit,
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              user: { select: { name: true, email: true } },
              items: { select: { product: { select: { name: true } }, quantity: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.return.count(),
    ]);

    return {
      returns,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createReturnRequest(data: any, requestUserId?: string) {
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // If requestUserId is provided (customer request), verify ownership
    if (requestUserId && order.userId !== requestUserId) {
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
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    const refund = await prisma.$transaction(async (tx) => {
      // Create refund record with PENDING status (not PAID immediately)
      const refundRecord = await tx.refund.create({
        data: {
          orderId: data.orderId,
          amount: data.amount,
          transactionId: data.transactionId,
          reason: data.reason,
          status: PaymentStatus.PENDING,
        },
      });

      // Restore inventory stock for refunded items
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
                note: `Refund stock recovery: ${order.orderNumber}`,
              },
            });
          }
        }
      }

      // Update order payment status
      await tx.order.update({
        where: { id: data.orderId },
        data: { paymentStatus: PaymentStatus.REFUNDED },
      });

      return refundRecord;
    });

    // Send refund confirmation email (fire-and-forget)
    try {
      const user = await prisma.user.findUnique({
        where: { id: order.userId },
        select: { email: true, name: true },
      });
      if (user?.email) {
        const refundHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #84cc16;">Refund Processed</h2>
            <p>Hi ${user.name},</p>
            <p>Your refund of <strong>₹${data.amount.toFixed(2)}</strong> for order <strong>${order.orderNumber}</strong> has been processed.</p>
            <p>The amount will be credited to your original payment method within 5-7 business days.</p>
            <br/>
            <p>Best regards,<br/>FlowNexa Team</p>
          </div>
        `;
        await sendMail(user.email, `Refund Confirmed - Order ${order.orderNumber}`, refundHtml);
      }
    } catch {
      // Non-critical
    }

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
