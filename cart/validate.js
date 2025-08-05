import { body, param, validationResult } from "express-validator";

// Validation result handler middleware
const handleValidationErrors = (req, res, next) => {
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

// Validate Cart Admin Route
const validateGetCartAdmin = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Invalid username format"),

  handleValidationErrors,
];

// Validate Create Cart
const validateCreateCart = [
  body("productId")
    .trim()
    .notEmpty()
    .withMessage("Product ID is required")
    .isLength({ min: 10, max: 50 })
    .withMessage("Invalid product ID format"),

  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be between 1 and 100"),

  handleValidationErrors,
];

// Cart Item Addition Validation
const validateAddItemToCart = [
  body("productId")
    .trim()
    .notEmpty()
    .withMessage("Product ID is required")
    .isLength({ min: 10, max: 50 })
    .withMessage("Invalid product ID format"),

  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be between 1 and 100"),

  handleValidationErrors,
];

// Cart Item Update Validation
const validateUpdateCartItem = [
  param("productId")
    .trim()
    .notEmpty()
    .withMessage("Product ID is required")
    .isLength({ min: 10, max: 50 })
    .withMessage("Invalid product ID format"),

  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be between 1 and 100"),

  handleValidationErrors,
];

// Cart Item Removal Validation
const validateRemoveCartItem = [
  param("productId")
    .trim()
    .notEmpty()
    .withMessage("Product ID is required")
    .isLength({ min: 10, max: 50 })
    .withMessage("Invalid product ID format"),

  handleValidationErrors,
];

export {
  validateGetCartAdmin,
  validateAddItemToCart,
  validateUpdateCartItem,
  validateRemoveCartItem,
  validateCreateCart,
};
