// middleware/mongoSanitize.js

/**
 * Custom MongoDB sanitization middleware
 * Removes or replaces potentially dangerous MongoDB operators
 */

const sanitizeValue = (value, replaceWith = "") => {
  if (typeof value === "string") {
    // Remove MongoDB operators from strings
    return value.replace(/^\$/, replaceWith);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, replaceWith));
  }

  if (value && typeof value === "object") {
    const sanitized = {};
    for (const [key, val] of Object.entries(value)) {
      // Remove keys that start with $ or contain dots (potential MongoDB operators)
      const sanitizedKey = key
        .replace(/^\$/, replaceWith)
        .replace(/\./g, replaceWith);
      sanitized[sanitizedKey] = sanitizeValue(val, replaceWith);
    }
    return sanitized;
  }

  return value;
};

const mongoSanitize = (options = {}) => {
  const {
    replaceWith = "_",
    sanitizeBody = true,
    sanitizeQuery = true,
    sanitizeParams = true,
    sanitizeHeaders = false,
  } = options;

  return (req, res, next) => {
    try {
      // Sanitize request body
      if (sanitizeBody && req.body) {
        req.body = sanitizeValue(req.body, replaceWith);
      }

      // Sanitize query parameters - create new object instead of modifying
      if (sanitizeQuery && req.query && Object.keys(req.query).length > 0) {
        const sanitizedQuery = sanitizeValue(req.query, replaceWith);
        // Replace the query object reference
        Object.keys(req.query).forEach((key) => delete req.query[key]);
        Object.assign(req.query, sanitizedQuery);
      }

      // Sanitize URL parameters
      if (sanitizeParams && req.params) {
        req.params = sanitizeValue(req.params, replaceWith);
      }

      // Optionally sanitize headers (usually not needed)
      if (sanitizeHeaders && req.headers) {
        const sanitizedHeaders = {};
        for (const [key, value] of Object.entries(req.headers)) {
          sanitizedHeaders[key] = sanitizeValue(value, replaceWith);
        }
        req.headers = sanitizedHeaders;
      }

      next();
    } catch (error) {
      console.error("Sanitization error:", error);
      next(error);
    }
  };
};

// Export the middleware factory
export default mongoSanitize;
