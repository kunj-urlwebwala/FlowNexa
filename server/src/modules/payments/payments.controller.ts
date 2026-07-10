import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { env } from "../../config/env";
import { successResponse } from "../../shared/utils/response.util";
import { logger } from "../../config/logger";
import { prisma } from "../../config/database";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@prisma/client";
import { addInvoiceEmailJob } from "../../jobs/queue";

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
   * Create a Stripe Checkout Session for an order
   */
  async createCheckoutSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId } = req.body;
      const userId = req.user?.userId as string;

      // Fetch order with items
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
      }

      // Verify ownership
      if (order.userId !== userId) {
        res.status(403).json({ success: false, message: "Unauthorized" });
        return;
      }

      // Build line items from order items
      const lineItems = order.items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.productName,
            description: `SKU: ${item.sku}`,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${env.FRONTEND_URL}/checkout?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
        cancel_url: `${env.FRONTEND_URL}/checkout?canceled=true&order_id=${orderId}`,
        customer_email: req.user?.email,
        metadata: {
          orderId: order.id,
        },
      });

      successResponse(res, "Checkout session created", {
        sessionId: session.id,
        url: session.url,
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
          req.body,
          sig,
          webhookSecret
        );
      } catch (err: any) {
        logger.error({ error: err.message }, "Stripe webhook signature verification failed");
        res.status(400).json({ error: `Webhook Error: ${err.message}` });
        return;
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: OrderStatus.CONFIRMED,
              paymentStatus: PaymentStatus.PAID,
            },
          });
          logger.info({ orderId, sessionId: session.id }, "Order confirmed via Stripe Checkout");

          // Send invoice email on successful payment
          try {
            await addInvoiceEmailJob(orderId);
          } catch (emailError) {
            logger.error({ error: emailError, orderId }, "Failed to send invoice on payment success");
          }
        }
      }

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: OrderStatus.CONFIRMED,
              paymentStatus: PaymentStatus.PAID,
            },
          });
          logger.info({ orderId, paymentIntentId: paymentIntent.id }, "Order confirmed via Stripe PaymentIntent");
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
