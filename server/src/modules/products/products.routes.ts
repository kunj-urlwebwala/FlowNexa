import { Router } from "express";
import { productsController } from "./products.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { createProductSchema, updateProductSchema, getProductByIdSchema, listProductsSchema } from "./products.dto";
import { AdminRole } from "@prisma/client";

const router = Router();

// Public routes
router.get("/", validateRequest(listProductsSchema), productsController.list);
router.get("/:id", validateRequest(getProductByIdSchema), productsController.getOne);

// Protected Admin-only routes
router.use(authMiddleware);
router.use(rbacMiddleware([
  AdminRole.SUPER_ADMIN,
  AdminRole.MANAGEMENT_TEAM,
  AdminRole.WAREHOUSE_MANAGER,
  AdminRole.ORDER_MANAGER
]));

router.post("/", validateRequest(createProductSchema), productsController.create);
router.patch("/:id", validateRequest(updateProductSchema), productsController.update);
router.delete("/:id", validateRequest(getProductByIdSchema), productsController.delete);

export default router;
