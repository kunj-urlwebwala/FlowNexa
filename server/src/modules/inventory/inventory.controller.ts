import { Request, Response, NextFunction } from "express";
import { inventoryService } from "./inventory.service";
import { successResponse } from "../../shared/utils/response.util";

export class InventoryController {
  // Warehouses
  async listWarehouses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = req.query as any;
      const result = await inventoryService.listWarehouses(page || 1, limit || 20);
      successResponse(res, "Warehouses listed successfully", result.items, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getWarehouse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const warehouse = await inventoryService.getWarehouseById(req.params.id as string);
      successResponse(res, "Warehouse details retrieved successfully", warehouse);
    } catch (error) {
      next(error);
    }
  }

  async createWarehouse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const warehouse = await inventoryService.createWarehouse(req.body);
      successResponse(res, "Warehouse created successfully", warehouse, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateWarehouse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await inventoryService.updateWarehouse(req.params.id as string, req.body);
      successResponse(res, "Warehouse updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteWarehouse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await inventoryService.deleteWarehouse(req.params.id as string);
      successResponse(res, "Warehouse deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  // Stock adjustments
  async adjustStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stock = await inventoryService.adjustStock(req.body);
      successResponse(res, "Stock level adjusted successfully", stock);
    } catch (error) {
      next(error);
    }
  }

  async listLedger(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = req.query as any;
      const result = await inventoryService.listStockLedger(page || 1, limit || 20);
      successResponse(res, "Stock ledger retrieved successfully", result.items, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  // Audits
  async listAudits(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = req.query as any;
      const result = await inventoryService.listAudits(page || 1, limit || 20);
      successResponse(res, "Stock audits listed successfully", result.items, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async createAudit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const audit = await inventoryService.createAudit(req.body);
      successResponse(res, "Stock audit scheduled successfully", audit, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateAudit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await inventoryService.updateAuditStatus(req.params.id as string, req.body.status);
      successResponse(res, "Stock audit status updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  // Restocking requests
  async listRestock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = req.query as any;
      const result = await inventoryService.listRestockRequests(page || 1, limit || 20);
      successResponse(res, "Restock requests listed successfully", result.items, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async createRestock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const request = await inventoryService.createRestockRequest(req.body);
      successResponse(res, "Restock request filed successfully", request, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateRestock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await inventoryService.updateRestockRequestStatus(req.params.id as string, req.body.status);
      successResponse(res, "Restock request status updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  // Damaged stock
  async listDamaged(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = req.query as any;
      const result = await inventoryService.listDamagedStock(page || 1, limit || 20);
      successResponse(res, "Damaged stock register listed successfully", result.items, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async createDamaged(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await inventoryService.createDamagedStock(req.body);
      successResponse(res, "Damaged stock quarantined successfully", record, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateDamaged(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await inventoryService.updateDamagedStatus(req.params.id as string, req.body.status);
      successResponse(res, "Damaged stock quarantine status updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }
}
export const inventoryController = new InventoryController();
