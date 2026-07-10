import type { ConnectionOptions } from "bullmq";
import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { aiCallsService } from "../../modules/ai-calls/ai-calls.service";

const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const connection = redis as unknown as ConnectionOptions;

export const verificationWorker = new Worker(
  "verificationQueue",
  async (job: Job) => {
    logger.info({ jobId: job.id, name: job.name, data: job.data }, "Processing verification job");

    if (job.name === "ai-verification-call") {
      await handleVerificationCall(job.data.orderId, job.data.attemptNumber);
    } else {
      logger.warn({ jobName: job.name }, "Unknown verification job type");
    }
  },
  {
    connection,
    concurrency: 3,
  }
);

/**
 * Initiate AI verification call
 */
async function handleVerificationCall(orderId: string, attemptNumber: number) {
  logger.info({ orderId, attemptNumber }, "Initiating AI verification call");
  await aiCallsService.initiateVerificationCall(orderId, attemptNumber);
}

// Worker event listeners
verificationWorker.on("completed", (job) => {
  logger.info({ jobId: job.id, name: job.name }, "Verification job completed successfully");
});

verificationWorker.on("failed", (job, error) => {
  logger.error({ jobId: job?.id, name: job?.name, error }, "Verification job failed");
});

export function startVerificationWorker() {
  logger.info("🤖 AI Verification Queue Worker initialized");
}
