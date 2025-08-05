import { Router } from "express";
import { 
  retrieveAllProducts, 
  retrieveProductsByCategory, 
  retrieveProductById, 
} from "./products.controller.js";
import {
  validateProductCategoryQuery,
  validateProductIdParam,
  validateProductSearchQuery
} from "./validate.js";

const router = Router();

// User and Guest routes
router.get("/", validateProductSearchQuery, retrieveAllProducts);
router.get("/search", validateProductCategoryQuery, retrieveProductsByCategory);
router.get("/:productId", validateProductIdParam, retrieveProductById);

export default router;
