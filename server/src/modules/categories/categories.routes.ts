import { Router } from "express";
import { categoriesController } from "./categories.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { createCategorySchema, updateCategorySchema, getCategoryByIdSchema } from "./categories.dto";
import { AdminRole } from "@prisma/client";

const router = Router();

// Public routes
router.get("/", categoriesController.list);
router.get("/:id", validateRequest(getCategoryByIdSchema), categoriesController.getOne);

// Protected Admin-only routes
router.use(authMiddleware);
router.use(rbacMiddleware([AdminRole.SUPER_ADMIN, AdminRole.MANAGEMENT_TEAM, AdminRole.WAREHOUSE_MANAGER]));

router.post("/", validateRequest(createCategorySchema), categoriesController.create);
router.patch("/:id", validateRequest(updateCategorySchema), categoriesController.update);
router.delete("/:id", validateRequest(getCategoryByIdSchema), categoriesController.delete);

export default router;
