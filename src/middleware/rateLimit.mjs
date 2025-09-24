import rateLimit from "express-rate-limit";
import { logger } from "./logger.mjs";

// Custom error handler for rate limit exceeded
const rateLimitHandler = (req, res, next, options) => {
  const error = {
    status: "error",
    message: "Too many requests, please try again later",
    retryAfter: Math.round(options.windowMs / 1000),
    limit: options.limit,
    windowMs: options.windowMs,
  };

  // Log rate limit violations
  logger.warn("Rate limit exceeded:", {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id || "anonymous",
    timestamp: new Date().toISOString(),
  });

  return res.status(429).json(error);
};

// Skip rate limit in certain conditions
// eslint-disable-next-line
const skipRequests = (req, res) => {
  // Skip for admin users (be careful with this)
  if (req.user?.role === "admin") {
    return true;
  }

  // Skip in development environment
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  return false;
};

// General rate limiter (most permissive)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // Limit each IP to 1000 requests per windowMs
  message: "Too many requests, please try again later",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: rateLimitHandler,
  skip: skipRequests,
});

export default limiter;
