import { Router } from "express";
import { marketingController } from "./marketing.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import {
  createCouponSchema,
  updateCouponSchema,
  createEmailTemplateSchema,
  createSubscriberSchema,
} from "./marketing.dto";
import { AdminRole } from "@prisma/client";

const router = Router();

// Public storefront endpoints
router.post("/subscribe", validateRequest(createSubscriberSchema), marketingController.addSubscriber);
router.get("/validate", marketingController.validateCoupon); // validate coupon query params

// Admin protected endpoints
router.use(authMiddleware);
router.use(rbacMiddleware([AdminRole.SUPER_ADMIN, AdminRole.MANAGEMENT_TEAM]));

// Coupons CRUD
router.get("/coupons", marketingController.listCoupons);
router.post("/coupons", validateRequest(createCouponSchema), marketingController.createCoupon);
router.patch("/coupons/:id", validateRequest(updateCouponSchema), marketingController.updateCoupon);

// Email templates CRUD
router.get("/templates", marketingController.listTemplates);
router.post("/templates", validateRequest(createEmailTemplateSchema), marketingController.createTemplate);

// Newsletter subscribers list
router.get("/subscribers", marketingController.listSubscribers);

export default router;
