import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import { U2000, U9550 } from "../config/roles.js";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  getProductStats,
} from "./products.adminController.js";
import {
  validateProductCreation,
  validateProductUpdate,
  validateProductDeletion,
} from "./validate.js";

const router = Router();

// Admin routes
router.get(
  "/stats",
  authenticate,
  verifyCsrfToken,
  authorize(U2000, U9550),
  getProductStats
);

router.post(
  "/create-product",
  authenticate,
  verifyCsrfToken,
  authorize(U2000, U9550),
  validateProductCreation,
  createProduct
);
router.delete(
  "/delete-product",
  authenticate,
  verifyCsrfToken,
  authorize(U2000, U9550),
  validateProductDeletion,
  deleteProduct
);

router.put(
  "/update-product/:productId",
  authenticate,
  verifyCsrfToken,
  authorize(U2000, U9550),
  validateProductUpdate,
  updateProduct
);

export default router;
