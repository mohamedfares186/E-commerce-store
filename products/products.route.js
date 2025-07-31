import express from "express";
import { 
  retrieveAllProducts, 
  retrieveProductsByCategory, 
  retrieveProductById, 
  createProduct, 
  deleteProduct, 
  updateProduct,
  getProductStats
} from "./products.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { U2000, U9550 } from "../config/roles.js";

const router = express.Router();

// User and Guest routes
router.get("/", retrieveAllProducts);
router.get("/search", retrieveProductsByCategory);
router.get("/:productId", retrieveProductById);


// Admin routes
router.get(
  "/admin/stats",
  authenticate,
  authorize(U2000, U9550),
  getProductStats
);

router.post(
  "/create-product",
  authenticate,
  authorize(U2000, U9550),
  createProduct
);
router.delete(
  "/delete-product",
  authenticate,
  authorize(U2000, U9550),
  deleteProduct
);

router.put(
  "/update-product/:productId",
  authenticate,
  authorize(U2000, U9550),
  updateProduct
);

export default router;
