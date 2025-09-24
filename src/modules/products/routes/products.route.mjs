import { Router } from "express";
import {
  retrieveAllProducts,
  retrieveProductsByCategory,
  retrieveProductById,
} from "../controllers/products.controller.mjs";
import {
  validateProductCategoryQuery,
  validateProductIdParam,
  validateProductSearchQuery,
} from "../validation/validate.mjs";

const router = Router();

// User and Guest routes
router.get("/", validateProductSearchQuery, retrieveAllProducts);
router.get("/search", validateProductCategoryQuery, retrieveProductsByCategory);
router.get("/:productId", validateProductIdParam, retrieveProductById);

export default router;
