import type { ConnectionOptions } from "bullmq";
import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { sendMail } from "../../shared/utils/email.util";
import { prisma } from "../../config/database";
import { generateInvoiceEmailHtml, generateInvoiceEmailSubject } from "../../shared/templates/invoice-email.template";

const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const connection = redis as unknown as ConnectionOptions;

export const emailWorker = new Worker(
  "emailQueue",
  async (job: Job) => {
    logger.info({ jobId: job.id, name: job.name }, "Processing email job");

    if (job.name === "send-invoice-email") {
      await handleInvoiceEmail(job.data.orderId);
      return;
    }

    const { to, subject, body } = job.data;
    await sendMail(to, subject, body);
  },
  {
    connection,
    concurrency: 5,
  }
);

async function handleInvoiceEmail(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
  });

  if (!order || !order.user) {
    logger.error({ orderId }, "Order or user not found for invoice email");
    throw new Error(`Order or user not found for invoice email (orderId: ${orderId})`);
  }

  if (!order.user.email) {
    logger.error({ orderId, user: order.user }, "User has no email for invoice");
    throw new Error(`User has no email for invoice (orderId: ${orderId})`);
  }

  const shippingAddr = order.shippingAddress as any;

  const emailHtml = generateInvoiceEmailHtml({
    customerName: order.user.name,
    orderNumber: order.orderNumber,
    orderDate: new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    items: order.items.map((item) => ({
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: order.subtotal,
    tax: order.tax,
    shippingCharges: order.shippingCharges,
    discount: order.discount,
    total: order.total,
    paymentMethod: order.paymentMethod,
    shippingAddress: shippingAddr || {},
  });

  const subject = generateInvoiceEmailSubject(order.orderNumber);
  const sent = await sendMail(order.user.email, subject, emailHtml);
  if (!sent) {
    throw new Error(`Failed to send invoice email for order ${orderId} to ${order.user.email}`);
  }
}

emailWorker.on("completed", (job) => {
  logger.info({ jobId: job.id }, "Email job completed successfully");
});

emailWorker.on("failed", (job, error) => {
  logger.error({ jobId: job?.id, error }, "Email job failed");
});

export function startEmailWorker() {
  logger.info("👷 Email Queue Worker initialized");
}
