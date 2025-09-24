import { Router } from "express";
import authenticate from "../../../middleware/authenticate.mjs";
import authorize from "../../../middleware/authorize.mjs";
import { validateCsrfToken } from "../../../middleware/csrf.mjs";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  getProductStats,
} from "../controllers/products.adminController.mjs";
import {
  validateProductCreation,
  validateProductUpdate,
  validateProductDeletion,
} from "../validation/validate.mjs";

const router = Router();

// Admin routes
router.get(
  "/stats",
  authenticate,
  validateCsrfToken,
  authorize("admin", "moderator"),
  getProductStats
);

router.post(
  "/create-product",
  authenticate,
  validateCsrfToken,
  authorize("admin", "moderator"),
  validateProductCreation,
  createProduct
);
router.delete(
  "/delete-product",
  authenticate,
  validateCsrfToken,
  authorize("admin", "moderator"),
  validateProductDeletion,
  deleteProduct
);

router.put(
  "/update-product/:productId",
  authenticate,
  validateCsrfToken,
  authorize("admin", "moderator"),
  validateProductUpdate,
  updateProduct
);

export default router;
