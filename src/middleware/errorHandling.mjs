import { logger } from "./logger.mjs";
import env from "../config/env.mjs";

// Development error response - includes stack trace
const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Production error response
const sendErrorProd = (err, res) => {
  if (err)
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
};

// eslint-disable-next-line
const errorHandling = (err, req, res, next) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Log error details
  const errorInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
    userId: req.user?.id || "anonymous",
  };

  if (err.statusCode >= 500) {
    logger.error("Server Error:", errorInfo);
  }

  if (err.statusCode >= 400) {
    logger.warn("Client Error:", errorInfo);
  }

  // Handle different environments
  if (env.env === "development") {
    sendErrorDev(err, res);
  }

  if (env.env === "production") {
    sendErrorProd(err, res);
  }
};

export default errorHandling;
