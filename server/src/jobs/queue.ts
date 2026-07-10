import type { ConnectionOptions } from "bullmq";
import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "../config/env";
import { logger } from "../config/logger";

const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  logger.info("✅ Redis connected successfully for BullMQ");
});

redis.on("error", (error) => {
  logger.error({ error }, "❌ Redis connection error for BullMQ");
});

const connection = redis as unknown as ConnectionOptions;

export const emailQueue = new Queue("emailQueue", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
  },
});

export const verificationQueue = new Queue("verificationQueue", {
  connection,
  defaultJobOptions: {
    attempts: 1, // We handle retries manually with progressive delays
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export async function addEmailJob(jobName: string, data: { to: string; subject: string; body: string }) {
  try {
    await emailQueue.add(jobName, data);
    logger.debug({ to: data.to, subject: data.subject }, "Job added to emailQueue");
  } catch (error) {
    logger.error({ error, data }, "Failed to add job to emailQueue");
  }
}

/**
 * Schedule invoice email for an order (immediate)
 * Uses emailQueue for retry support (3 attempts with exponential backoff)
 */
export async function addInvoiceEmailJob(orderId: string) {
  try {
    await emailQueue.add("send-invoice-email", { orderId }, { delay: 0 });
    logger.debug({ orderId }, "Invoice email job scheduled in emailQueue");
  } catch (error) {
    logger.error({ error, orderId }, "Failed to schedule invoice email job");
  }
}

/**
 * Schedule AI verification call with delay
 * @param delayMs - delay in milliseconds before the call is placed
 * @param attemptNumber - which attempt this is (1, 2, or 3)
 */
export async function addVerificationCallJob(orderId: string, attemptNumber: number, delayMs: number) {
  try {
    await verificationQueue.add(
      "ai-verification-call",
      { orderId, attemptNumber },
      { delay: delayMs }
    );
    logger.debug({ orderId, attemptNumber, delayMs }, "AI verification call job scheduled");
  } catch (error) {
    logger.error({ error, orderId }, "Failed to schedule AI verification call job");
  }
}

