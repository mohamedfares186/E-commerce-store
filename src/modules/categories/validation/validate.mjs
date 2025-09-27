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

// Category Creation Validation
export const validateCategoryCreation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Category title is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category title must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage(
      "Category title can only contain letters, numbers, spaces, hyphens, and underscores"
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Category description cannot exceed 500 characters"),

  body("slug")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category slug must be between 2 and 50 characters")
    .matches(/^[a-z0-9\-]+$/)
    .withMessage(
      "Category slug can only contain lowercase letters, numbers, and hyphens"
    ),

  handleValidationErrors,
];

// Category Deletion Validation
export const validateCategoryDeletion = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Category title is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Invalid title format"),

  handleValidationErrors,
];

// Category Slug Parameter Validation
export const validateCategorySlugParam = [
  param("slug")
    .trim()
    .notEmpty()
    .withMessage("Category slug is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Category slug must be between 2 and 50 characters")
    .matches(/^[a-z0-9\-]+$/)
    .withMessage(
      "Category slug can only contain lowercase letters, numbers, and hyphens"
    ),

  handleValidationErrors,
];

// Category Query Validation
export const validateCategoryQuery = [
  query("sort")
    .optional()
    .isIn([
      "name_asc",
      "name_desc",
      "sortOrder_asc",
      "sortOrder_desc",
      "createdAt_asc",
      "createdAt_desc",
    ])
    .withMessage("Invalid sort option"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  handleValidationErrors,
];

// Category Search Validation
export const validateCategorySearch = [
  query("search")
    .trim()
    .notEmpty()
    .withMessage("Search term is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 2 and 100 characters"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),

  handleValidationErrors,
];
