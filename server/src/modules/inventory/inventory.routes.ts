import { Router } from "express";
import { inventoryController } from "./inventory.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import {
  createWarehouseSchema,
  updateWarehouseSchema,
  adjustStockSchema,
  createStockAuditSchema,
  updateStockAuditStatusSchema,
  createRestockRequestSchema,
  updateRestockRequestStatusSchema,
  createDamagedStockSchema,
  updateDamagedStockStatusSchema,
} from "./inventory.dto";
import { AdminRole } from "@prisma/client";

const router = Router();

// Apply authentication and base admin guards on all routes
router.use(authMiddleware);
router.use(rbacMiddleware([
  AdminRole.SUPER_ADMIN,
  AdminRole.MANAGEMENT_TEAM,
  AdminRole.WAREHOUSE_MANAGER,
]));

// Warehouses
router.get("/warehouses", inventoryController.listWarehouses);
router.get("/warehouses/:id", inventoryController.getWarehouse);
router.post("/warehouses", validateRequest(createWarehouseSchema), inventoryController.createWarehouse);
router.patch("/warehouses/:id", validateRequest(updateWarehouseSchema), inventoryController.updateWarehouse);
router.delete("/warehouses/:id", inventoryController.deleteWarehouse);

// Stock adjustments
router.post("/adjust", validateRequest(adjustStockSchema), inventoryController.adjustStock);
router.get("/ledger", inventoryController.listLedger);

// Audits
router.get("/audits", inventoryController.listAudits);
router.post("/audits", validateRequest(createStockAuditSchema), inventoryController.createAudit);
router.patch("/audits/:id", validateRequest(updateStockAuditStatusSchema), inventoryController.updateAudit);

// Restocking
router.get("/restock", inventoryController.listRestock);
router.post("/restock", validateRequest(createRestockRequestSchema), inventoryController.createRestock);
router.patch("/restock/:id", validateRequest(updateRestockRequestStatusSchema), inventoryController.updateRestock);

// Damaged stock
router.get("/damaged", inventoryController.listDamaged);
router.post("/damaged", validateRequest(createDamagedStockSchema), inventoryController.createDamaged);
router.patch("/damaged/:id", validateRequest(updateDamagedStockStatusSchema), inventoryController.updateDamaged);

export default router;
