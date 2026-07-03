import { Router } from "express";
import { ordersController } from "./orders.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  listOrdersSchema,
  getOrderByIdSchema,
  createReturnSchema,
  updateReturnStatusSchema,
  createRefundSchema,
  cancelReasonSchema,
} from "./orders.dto";
import { AdminRole } from "@prisma/client";

const router = Router();

// Apply auth to all endpoints
router.use(authMiddleware);

// Storefront customer endpoints
router.post("/", validateRequest(createOrderSchema), ordersController.create);
router.get("/my-orders", ordersController.getMyOrders);
router.post("/returns", validateRequest(createReturnSchema), ordersController.createReturn);
router.get("/cancel-reasons", ordersController.listCancelReasons);

// Admin-only routing boundaries
router.get("/", rbacMiddleware([
  AdminRole.SUPER_ADMIN,
  AdminRole.MANAGEMENT_TEAM,
  AdminRole.ORDER_MANAGER,
  AdminRole.SUPPORT_STAFF,
]), validateRequest(listOrdersSchema), ordersController.list);

router.get("/:id", validateRequest(getOrderByIdSchema), ordersController.getOne);

router.patch("/:id/status", rbacMiddleware([
  AdminRole.SUPER_ADMIN,
  AdminRole.MANAGEMENT_TEAM,
  AdminRole.ORDER_MANAGER,
  AdminRole.SUPPORT_STAFF,
]), validateRequest(updateOrderStatusSchema), ordersController.updateStatus);

router.get("/returns", rbacMiddleware([
  AdminRole.SUPER_ADMIN,
  AdminRole.MANAGEMENT_TEAM,
  AdminRole.ORDER_MANAGER,
  AdminRole.SUPPORT_STAFF,
]), ordersController.listReturns);

router.patch("/returns/:id", rbacMiddleware([
  AdminRole.SUPER_ADMIN,
  AdminRole.MANAGEMENT_TEAM,
  AdminRole.ORDER_MANAGER,
  AdminRole.SUPPORT_STAFF,
]), validateRequest(updateReturnStatusSchema), ordersController.updateReturn);

router.post("/refunds", rbacMiddleware([
  AdminRole.SUPER_ADMIN,
  AdminRole.MANAGEMENT_TEAM,
  AdminRole.ORDER_MANAGER,
]), validateRequest(createRefundSchema), ordersController.createRefund);

router.post("/cancel-reasons", rbacMiddleware([
  AdminRole.SUPER_ADMIN,
  AdminRole.MANAGEMENT_TEAM,
]), validateRequest(cancelReasonSchema), ordersController.createCancelReason);

export default router;
