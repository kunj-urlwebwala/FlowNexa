import type { ConnectionOptions } from "bullmq";
import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { sendMail } from "../../shared/utils/email.util";

const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const connection = redis as unknown as ConnectionOptions;

export const emailWorker = new Worker(
  "emailQueue",
  async (job: Job) => {
    logger.info({ jobId: job.id, name: job.name }, "Processing email job");
    const { to, subject, body } = job.data;
    await sendMail(to, subject, body);
  },
  {
    connection,
    concurrency: 5,
  }
);

emailWorker.on("completed", (job) => {
  logger.info({ jobId: job.id }, "Email job completed successfully");
});

emailWorker.on("failed", (job, error) => {
  logger.error({ jobId: job?.id, error }, "Email job failed");
});

export function startEmailWorker() {
  logger.info("👷 Email Queue Worker initialized");
}
