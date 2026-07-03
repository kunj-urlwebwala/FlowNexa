import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { AdminRole } from "@prisma/client";

const router = Router();

router.use(authMiddleware);
router.use(rbacMiddleware([
  AdminRole.SUPER_ADMIN,
  AdminRole.MANAGEMENT_TEAM,
]));

router.get("/stats", dashboardController.getStats);

export default router;
