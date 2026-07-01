import { Router } from "express";
import { aiCallsController } from "./ai-calls.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { AdminRole } from "@prisma/client";

const router = Router();

// Webhook endpoint - NO auth required (Bland.ai sends callbacks here)
router.post("/webhook", aiCallsController.handleWebhook);

// Admin-only endpoints (require auth + admin role)
router.use(authMiddleware);

router.get("/stats", rbacMiddleware([
  AdminRole.SUPER_ADMIN,
  AdminRole.MANAGEMENT_TEAM,
]), aiCallsController.getCallStats);

router.get("/", rbacMiddleware([
  AdminRole.SUPER_ADMIN,
  AdminRole.MANAGEMENT_TEAM,
  AdminRole.ORDER_MANAGER,
  AdminRole.SUPPORT_STAFF,
]), aiCallsController.listAllCalls);

router.get("/order/:orderId", rbacMiddleware([
  AdminRole.SUPER_ADMIN,
  AdminRole.MANAGEMENT_TEAM,
  AdminRole.ORDER_MANAGER,
  AdminRole.SUPPORT_STAFF,
]), aiCallsController.getOrderCallLogs);

router.post("/retry/:orderId", rbacMiddleware([
  AdminRole.SUPER_ADMIN,
  AdminRole.MANAGEMENT_TEAM,
]), aiCallsController.retryCall);

export default router;
