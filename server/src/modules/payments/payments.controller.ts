import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { env } from "../../config/env";
import { successResponse } from "../../shared/utils/response.util";

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
      const { amount } = req.body; // in INR

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // convert to paise
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
}
export const paymentsController = new PaymentsController();
