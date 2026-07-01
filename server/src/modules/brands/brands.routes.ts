import { Router } from "express";
import { brandsController } from "./brands.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { createBrandSchema, updateBrandSchema, getBrandByIdSchema } from "./brands.dto";
import { AdminRole } from "@prisma/client";

const router = Router();

// Public routes
router.get("/", brandsController.list);
router.get("/:id", validateRequest(getBrandByIdSchema), brandsController.getOne);

// Protected Admin-only routes
router.use(authMiddleware);
router.use(rbacMiddleware([AdminRole.SUPER_ADMIN, AdminRole.MANAGEMENT_TEAM, AdminRole.WAREHOUSE_MANAGER]));

router.post("/", validateRequest(createBrandSchema), brandsController.create);
router.patch("/:id", validateRequest(updateBrandSchema), brandsController.update);
router.delete("/:id", validateRequest(getBrandByIdSchema), brandsController.delete);

export default router;
