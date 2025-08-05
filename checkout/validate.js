import { body, param, validationResult } from "express-validator";

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

// Checkout Process Validation
export const validateCheckout = [
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Shipping address is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Address must be between 10 and 500 characters"),

  body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["cashOnDelivery", "card"])
    .withMessage("Invalid payment method"),

  body("card")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Card type must be between 2 and 50 characters"),

  body("cardNumber")
    .optional()
    .trim()
    .matches(/^\d{13,19}$/)
    .withMessage("Card number must be between 13 and 19 digits"),

  body("cardExpiry")
    .optional()
    .trim()
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)
    .withMessage("Card expiry must be in MM/YY format"),

  body("cardCvv")
    .optional()
    .trim()
    .matches(/^\d{3,4}$/)
    .withMessage("CVV must be 3 or 4 digits"),

  handleValidationErrors,
];

// Order Verification Validation
export const validateOrderVerification = [
  param("token")
    .trim()
    .notEmpty()
    .withMessage("Verification token is required")
    .isLength({ min: 20 })
    .withMessage("Invalid verification token format"),

  handleValidationErrors,
];

// Payment Method Validation
export const validatePaymentMethod = [
  body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["cashOnDelivery", "card"])
    .withMessage("Invalid payment method"),

  body("cardDetails")
    .optional()
    .isObject()
    .withMessage("Card details must be an object"),

  body("cardDetails.cardType")
    .optional()
    .trim()
    .isIn(["visa", "mastercard"])
    .withMessage("Invalid card type"),

  body("cardDetails.cardNumber")
    .optional()
    .trim()
    .matches(/^\d{13,19}$/)
    .withMessage("Card number must be between 13 and 19 digits"),

  body("cardDetails.expiryMonth")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Expiry month must be between 1 and 12"),

  body("cardDetails.expiryYear")
    .optional()
    .isInt({
      min: new Date().getFullYear(),
      max: new Date().getFullYear() + 20,
    })
    .withMessage("Expiry year must be valid"),

  body("cardDetails.cvv")
    .optional()
    .trim()
    .matches(/^\d{3,4}$/)
    .withMessage("CVV must be 3 or 4 digits"),

  handleValidationErrors,
];
