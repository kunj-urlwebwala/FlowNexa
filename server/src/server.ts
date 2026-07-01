import app from "./app";
import { env } from "./config/env";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { logger } from "./config/logger";
import { startEmailWorker, emailWorker } from "./jobs/workers/email.worker";
import { startVerificationWorker, verificationWorker } from "./jobs/workers/verification-call.worker";

const PORT = env.PORT;

async function bootstrap() {
  // Connect to database
  await connectDatabase();

  // Start background workers
  startEmailWorker();
  startVerificationWorker();

  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });

  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    
    server.close(async () => {
      logger.info("HTTP server closed.");
      await emailWorker.close();
      await verificationWorker.close();
      logger.info("Queue workers closed.");
      await disconnectDatabase();
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error("Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

bootstrap().catch((err) => {
  logger.fatal({ err }, "Unhandled error during bootstrap");
  process.exit(1);
});
