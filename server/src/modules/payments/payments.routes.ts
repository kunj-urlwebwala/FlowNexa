import { Router } from "express";
import { paymentsController } from "./payments.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import express from "express";

const router = Router();

// Stripe webhook endpoint - NO auth required (Stripe sends this)
// Using raw body for signature verification
router.post("/webhook", express.raw({ type: "application/json" }), paymentsController.handleStripeWebhook);

// Protected routes
router.use(authMiddleware);
router.post("/create-intent", paymentsController.createIntent);

export default router;
