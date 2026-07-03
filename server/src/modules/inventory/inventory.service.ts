import { prisma } from "../../config/database";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError";

export class InventoryService {
  // ----------------------------------------------------
  // WAREHOUSES CRUD
  // ----------------------------------------------------

  async listWarehouses(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.warehouse.findMany({
        skip,
        take: limit,
        include: { _count: { select: { stocks: true } } },
        orderBy: { name: "asc" },
      }),
      prisma.warehouse.count(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getWarehouseById(id: string) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: {
        stocks: {
          include: {
            product: { select: { id: true, name: true, slug: true } },
            variant: true,
          },
        },
      },
    });

    if (!warehouse) {
      throw new NotFoundError("Warehouse details not found");
    }

    return warehouse;
  }

  async createWarehouse(data: any) {
    const existing = await prisma.warehouse.findFirst({
      where: {
        OR: [{ name: data.name }, { code: data.code }],
      },
    });

    if (existing) {
      throw new ConflictError("Warehouse name or code already exists");
    }

    return prisma.warehouse.create({
      data: {
        name: data.name,
        code: data.code.toUpperCase(),
        address: data.address,
        capacity: data.capacity,
      },
    });
  }

  async updateWarehouse(id: string, data: any) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundError("Warehouse not found");
    }

    return prisma.warehouse.update({
      where: { id },
      data,
    });
  }

  async deleteWarehouse(id: string) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: {
        _count: {
          select: { stocks: true },
        },
      },
    });

    if (!warehouse) {
      throw new NotFoundError("Warehouse not found");
    }

    if (warehouse._count.stocks > 0) {
      throw new ConflictError("Cannot delete warehouse containing stock levels");
    }

    await prisma.warehouse.delete({
      where: { id },
    });

    return null;
  }

  // ----------------------------------------------------
  // STOCK ADJUSTMENTS & LEDGER
  // ----------------------------------------------------

  async adjustStock(data: any) {
    const { warehouseId, productId, variantId, quantity, type, note } = data;

    // Verify warehouse and product exist
    const warehouse = await prisma.warehouse.findUnique({ where: { id: warehouseId } });
    if (!warehouse) throw new NotFoundError("Warehouse not found");

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundError("Product not found");

    if (variantId) {
      const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
      if (!variant) throw new NotFoundError("Product variant not found");
    }

    // Run adjustment in a Transaction
    const updatedStock = await prisma.$transaction(async (tx) => {
      // Find or create the stock record
      const stock = await tx.inventoryStock.findUnique({
        where: {
          warehouseId_productId_variantId: {
            warehouseId,
            productId,
            variantId: variantId || null,
          },
        },
      });

      let nextQuantity = quantity;
      let targetStockId = "";

      if (stock) {
        nextQuantity = stock.quantity + quantity;
        if (nextQuantity < 0) {
          throw new ConflictError("Adjustment would result in negative stock level");
        }

        const updated = await tx.inventoryStock.update({
          where: { id: stock.id },
          data: { quantity: nextQuantity },
        });
        targetStockId = updated.id;
      } else {
        if (quantity < 0) {
          throw new ConflictError("Cannot initialize stock level with a negative value");
        }

        const created = await tx.inventoryStock.create({
          data: {
            warehouseId,
            productId,
            variantId: variantId || null,
            quantity,
          },
        });
        targetStockId = created.id;
      }

      // Log to ledger
      await tx.stockLedger.create({
        data: {
          warehouseId,
          productId,
          variantId: variantId || null,
          type,
          quantity,
          note,
        },
      });

      return tx.inventoryStock.findUnique({
        where: { id: targetStockId },
        include: {
          product: { select: { name: true } },
          warehouse: { select: { name: true } },
        },
      });
    });

    return updatedStock;
  }

  async listStockLedger(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.stockLedger.findMany({
        skip,
        take: limit,
        include: { warehouse: { select: { name: true, code: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.stockLedger.count(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  // ----------------------------------------------------
  // STOCK AUDITS
  // ----------------------------------------------------

  async listAudits(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.stockAudit.findMany({ skip, take: limit, orderBy: { auditDate: "desc" } }),
      prisma.stockAudit.count(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createAudit(data: any) {
    return prisma.stockAudit.create({
      data: {
        title: data.title,
        warehouseName: data.warehouseName,
        auditDate: data.auditDate,
        inspector: data.inspector,
        status: "PENDING",
      },
    });
  }

  async updateAuditStatus(id: string, status: string) {
    const audit = await prisma.stockAudit.findUnique({ where: { id } });
    if (!audit) throw new NotFoundError("Stock audit not found");

    return prisma.stockAudit.update({
      where: { id },
      data: { status },
    });
  }

  // ----------------------------------------------------
  // RESTOCK REQUESTS
  // ----------------------------------------------------

  async listRestockRequests(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.restockRequest.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.restockRequest.count(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createRestockRequest(data: any) {
    return prisma.restockRequest.create({
      data: {
        productName: data.productName,
        quantity: data.quantity,
        warehouseName: data.warehouseName,
        urgency: data.urgency,
        status: "PENDING",
      },
    });
  }

  async updateRestockRequestStatus(id: string, status: string) {
    const request = await prisma.restockRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundError("Restock request not found");

    return prisma.restockRequest.update({
      where: { id },
      data: { status },
    });
  }

  // ----------------------------------------------------
  // DAMAGED STOCK
  // ----------------------------------------------------

  async listDamagedStock(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.damagedStock.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.damagedStock.count(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createDamagedStock(data: any) {
    return prisma.damagedStock.create({
      data: {
        productName: data.productName,
        sku: data.sku,
        quantity: data.quantity,
        warehouseName: data.warehouseName,
        reason: data.reason,
        status: "QUARANTINED",
      },
    });
  }

  async updateDamagedStatus(id: string, status: string) {
    const record = await prisma.damagedStock.findUnique({ where: { id } });
    if (!record) throw new NotFoundError("Damaged stock record not found");

    return prisma.damagedStock.update({
      where: { id },
      data: { status },
    });
  }
}
export const inventoryService = new InventoryService();
