import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { env } from "../../config/env";
import { successResponse } from "../../shared/utils/response.util";
import { logger } from "../../config/logger";
import { prisma } from "../../config/database";
import { OrderStatus, PaymentStatus } from "@prisma/client";

const stripe = new Stripe(
  env.STRIPE_SECRET_KEY === "sk_test_placeholder"
    ? "sk_test_51MockKeyStubPleaseReplaceWithRealStripeKey"
    : env.STRIPE_SECRET_KEY,
  {
    apiVersion: "2025-01-27-acls" as any,
  }
);

export class PaymentsController {
  async createIntent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "inr",
        payment_method_types: ["card"],
      });

      successResponse(res, "Payment intent created successfully", {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Handle Stripe webhook (no auth - Stripe sends this)
   */
  async handleStripeWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sig = req.headers["stripe-signature"] as string;
      let event: Stripe.Event;

      try {
        const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
          logger.error("STRIPE_WEBHOOK_SECRET is not configured");
          res.status(500).json({ error: "Webhook secret not configured" });
          return;
        }

        event = stripe.webhooks.constructEvent(
          req.body, // raw body
          sig,
          webhookSecret
        );
      } catch (err: any) {
        logger.error({ error: err.message }, "Stripe webhook signature verification failed");
        res.status(400).json({ error: `Webhook Error: ${err.message}` });
        return;
      }

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: PaymentStatus.PAID },
          });
          logger.info({ orderId, paymentIntentId: paymentIntent.id }, "Payment confirmed via Stripe webhook");
        }
      }

      res.status(200).json({ received: true });
    } catch (error) {
      logger.error({ error }, "Error processing Stripe webhook");
      res.status(200).json({ received: true });
    }
  }
}
export const paymentsController = new PaymentsController();
