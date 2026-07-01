import rateLimit from "express-rate-limit";
import { env } from "../config/env";
import { errorResponse } from "../shared/utils/response.util";

export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    errorResponse(
      res,
      "Too many requests from this IP, please try again after 15 minutes",
      429
    );
  },
});
