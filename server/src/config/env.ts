import { z } from "zod";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: "./.env.production" });
} else {
  dotenv.config();
}

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  API_VERSION: z.string().default("v1"),
  APP_NAME: z.string().default("FlowNexa"),
  APP_URL: z.string().default("http://localhost:5000"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  ADMIN_URL: z.string().default("http://localhost:3001"),

  // Database
  DATABASE_URL: z.string(),

  // Redis
  REDIS_URL: z.string().default("redis://localhost:6379"),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // SMTP
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default("noreply@flownexa.com"),

  // CORS
  CORS_ORIGIN: z.string().default("http://localhost:3000,http://localhost:3001"),

  // Rate Limit
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  // Logging
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("debug"),

  // Stripe
  STRIPE_SECRET_KEY: z.string().default("sk_test_placeholder"),
  STRIPE_WEBHOOK_SECRET: z.string().default(""),

  // AI Calling Agent (Retell.ai)
  RETELL_API_KEY: z.string().default(""),
  RETELL_AGENT_ID: z.string().default(""),
  RETELL_FROM_NUMBER: z.string().default(""),
  RETELL_WEBHOOK_SECRET: z.string().default(""),

  // OpenAI
  OPENAI_API_KEY: z.string().default(""),

  // Exotel
  EXOTEL_ACCOUNT_SID: z.string().default(""),
  EXOTEL_API_KEY: z.string().default(""),
  EXOTEL_API_TOKEN: z.string().default(""),
  EXOTEL_VIRTUAL_NUMBER: z.string().default(""),
  EXOTEL_API_DOMAIN: z.string().default("api.in.exotel.com"),
  EXOTEL_FLOW_URL: z.string().default(""),
  EXOTEL_AUDIO_FORMAT: z.enum(["pcm16", "g711_ulaw", "g711_alaw"]).default("pcm16"),

  // Bot Server
  BOT_PORT: z.coerce.number().default(9090),
  BOT_PUBLIC_URL: z.string().default("wss://localhost:9090"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
