import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import hpp from "hpp";
import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { rateLimiter } from "./middleware/rateLimiter.middleware";
import { logger } from "./config/logger";

// Import Routes
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import teamsRoutes from "./modules/teams/teams.routes";
import categoriesRoutes from "./modules/categories/categories.routes";
import brandsRoutes from "./modules/brands/brands.routes";
import productsRoutes from "./modules/products/products.routes";
import ordersRoutes from "./modules/orders/orders.routes";
import inventoryRoutes from "./modules/inventory/inventory.routes";
import financeRoutes from "./modules/finance/finance.routes";
import crmRoutes from "./modules/crm/crm.routes";
import cmsRoutes from "./modules/cms/cms.routes";
import marketingRoutes from "./modules/marketing/marketing.routes";
import paymentsRoutes from "./modules/payments/payments.routes";
import aiCallsRoutes from "./modules/ai-calls/ai-calls.routes";
import cartRoutes from "./modules/cart/cart.routes";
import wishlistRoutes from "./modules/wishlist/wishlist.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import { setupSwagger } from "./config/swagger";

const app: Express = express();

// Security headers
app.use(helmet());

// Content compression
app.use(compression());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// CORS config
const allowedOrigins = env.CORS_ORIGIN.split(",");
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Morgan logging with pino in production, custom in development
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );
}

// Global rate limiting
app.use(rateLimiter);

// Mount API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/teams", teamsRoutes);
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/brands", brandsRoutes);
app.use("/api/v1/products", productsRoutes);
app.use("/api/v1/orders", ordersRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/finance", financeRoutes);
app.use("/api/v1/crm", crmRoutes);
app.use("/api/v1/cms", cmsRoutes);
app.use("/api/v1/marketing", marketingRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/ai-calls", aiCallsRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Setup Swagger Docs
setupSwagger(app);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date(),
    env: env.NODE_ENV,
  });
});

// Fallback route 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
    data: null,
    meta: null,
    errors: null,
  });
});

// Error handling middleware
app.use(errorMiddleware);

export default app;
