import { PrismaClient } from "@prisma/client";
import { env } from "./env";
import { logger } from "./logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development"
        ? [
            { level: "query", emit: "event" },
            { level: "error", emit: "stdout" },
            { level: "warn", emit: "stdout" },
          ]
        : [{ level: "error", emit: "stdout" }],
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Log slow queries in development
if (env.NODE_ENV === "development") {
  prisma.$on("query" as never, (e: any) => {
    if (e.duration > 100) {
      logger.warn({ duration: e.duration, query: e.query }, "Slow query detected");
    }
  });
}

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info("✅ Database connected successfully");
  } catch (error) {
    logger.fatal({ error }, "❌ Failed to connect to database");
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info("Database disconnected");
}
