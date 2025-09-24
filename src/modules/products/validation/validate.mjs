import { body, param, query, validationResult } from 'express-validator';

// Validation result handler middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Product Creation Validation
export const validateProductCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Product title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product title must be between 3 and 200 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/)
    .withMessage('Product title contains invalid characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Product description must be between 10 and 2000 characters'),
  
  body('price')
    .trim()
    .notEmpty()
    .withMessage('Product price is required')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Price must be a valid number between 0.01 and 999,999.99'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Product category is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Category contains invalid characters'),
  
  body('imagePath')
    .trim()
    .notEmpty()
    .withMessage('Product image path is required')
    .isURL({
      require_protocol: false,
      require_host: false,
      require_port: false
    })
    .withMessage('Please provide a valid image URL')
    .custom((value) => {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const hasValidExtension = allowedExtensions.some(ext => 
        value.toLowerCase().endsWith(ext)
      );
      if (!hasValidExtension) {
        throw new Error('Image must be a valid image file (jpg, jpeg, png, gif, webp)');
      }
      return true;
    }),
  
  body('stock')
    .trim()
    .notEmpty()
    .withMessage('Product stock is required')
    .isInt({ min: 0, max: 999999 })
    .withMessage('Stock must be a valid integer between 0 and 999,999'),
  
  body('available')
    .notEmpty()
    .withMessage('Product availability status is required')
    .isBoolean()
    .withMessage('Available must be a boolean value (true/false)'),
  
  handleValidationErrors
];

// Product Update Validation
export const validateProductUpdate = [
  param('productId')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required')
    .isLength({ min: 10, max: 50 })
    .withMessage('Invalid product ID format'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product title cannot be empty')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product title must be between 3 and 200 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/)
    .withMessage('Product title contains invalid characters'),
  
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product description cannot be empty')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Product description must be between 10 and 2000 characters'),
  
  body('price')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product price cannot be empty')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Price must be a valid number between 0.01 and 999,999.99'),
  
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product category cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Category contains invalid characters'),
  
  body('imagePath')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product image path cannot be empty')
    .isURL({
      require_protocol: false,
      require_host: false,
      require_port: false
    })
    .withMessage('Please provide a valid image URL')
    .custom((value) => {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const hasValidExtension = allowedExtensions.some(ext => 
        value.toLowerCase().endsWith(ext)
      );
      if (!hasValidExtension) {
        throw new Error('Image must be a valid image file (jpg, jpeg, png, gif, webp)');
      }
      return true;
    }),
  
  body('stock')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product stock cannot be empty')
    .isInt({ min: 0, max: 999999 })
    .withMessage('Stock must be a valid integer between 0 and 999,999'),
  
  body('available')
    .optional()
    .notEmpty()
    .withMessage('Product availability status cannot be empty')
    .isBoolean()
    .withMessage('Available must be a boolean value (true/false)'),
  
  handleValidationErrors
];

// Product Deletion Validation
export const validateProductDeletion = [
  body('productId')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required')
    .isLength({ min: 10, max: 50 })
    .withMessage('Invalid product ID format'),
  
  handleValidationErrors
];

// Product ID Parameter Validation
export const validateProductIdParam = [
  param('productId')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required')
    .isLength({ min: 10, max: 50 })
    .withMessage('Invalid product ID format'),
  
  handleValidationErrors
];

// Product Category Query Validation
export const validateProductCategoryQuery = [
  query('category')
    .trim()
    .notEmpty()
    .withMessage('Category parameter is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Category contains invalid characters'),
  
  handleValidationErrors
];

// Product Search Query Validation
export const validateProductSearchQuery = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search term must be between 2 and 100 characters'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a valid positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a valid positive number')
    .custom((value, { req }) => {
      if (req.query.minPrice && parseFloat(value) < parseFloat(req.query.minPrice)) {
        throw new Error('Maximum price cannot be less than minimum price');
      }
      return true;
    }),
  
  query('sort')
    .optional()
    .isIn(['price', "available"])
    .withMessage('Invalid sort option'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  handleValidationErrors
];

// Product Filter Validation
export const validateProductFilter = [
  query('available')
    .optional()
    .isBoolean()
    .withMessage('Available filter must be a boolean value'),
  
  query('inStock')
    .optional()
    .isBoolean()
    .withMessage('In stock filter must be a boolean value'),
  
  query('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array'),
  
  handleValidationErrors
];
