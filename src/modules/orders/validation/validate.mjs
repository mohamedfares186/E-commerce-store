import { body, param, query, validationResult } from "express-validator";

// Validation result handler middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// Order ID Parameter Validation
export const validateOrderIdParam = [
  param("orderId")
    .trim()
    .notEmpty()
    .withMessage("Order ID is required")
    .isLength({ min: 10, max: 50 })
    .withMessage("Invalid order ID format"),

  handleValidationErrors,
];

// Order Query Validation
export const validateOrderQuery = [
  query("status")
    .optional()
    .isIn([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ])
    .withMessage("Invalid order status filter"),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (
        req.query.startDate &&
        new Date(value) < new Date(req.query.startDate)
      ) {
        throw new Error("End date cannot be before start date");
      }
      return true;
    }),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("sort")
    .optional()
    .isIn(["date_asc", "date_desc", "total_asc", "total_desc", "status"])
    .withMessage("Invalid sort option"),

  handleValidationErrors,
];

// Order Status Update Validation
export const validateOrderUpdate = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("User Not Found"),

  body("status")
    .trim()
    .notEmpty()
    .withMessage("Order status is required")
    .isIn([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ])
    .withMessage("Invalid order status"),

  handleValidationErrors,
];

// Order Deletion Validation
export const validateOrderDeletion = [
  body("orderId")
    .trim()
    .notEmpty()
    .withMessage("Order ID is required")
    .isLength({ min: 10, max: 50 })
    .withMessage("Invalid order ID format"),

  handleValidationErrors,
];

// Admin Order Operations Validation
export const validateAdminOrderQuery = [
  query("userId")
    .optional()
    .trim()
    .isLength({ min: 10, max: 50 })
    .withMessage("Invalid user ID format"),

  query("status")
    .optional()
    .isIn([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ])
    .withMessage("Invalid order status filter"),

  query("paymentMethod")
    .optional()
    .isIn(["cashOnDelivery", "card"])
    .withMessage("Invalid payment method filter"),

  query("minAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum amount must be a valid positive number"),

  query("maxAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum amount must be a valid positive number")
    .custom((value, { req }) => {
      if (
        req.query.minAmount &&
        parseFloat(value) < parseFloat(req.query.minAmount)
      ) {
        throw new Error("Maximum amount cannot be less than minimum amount");
      }
      return true;
    }),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("sort")
    .optional()
    .isIn([
      "date_asc",
      "date_desc",
      "total_asc",
      "total_desc",
      "status",
      "user",
    ])
    .withMessage("Invalid sort option"),

  handleValidationErrors,
];
