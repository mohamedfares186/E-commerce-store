import express from "express";
import {
  getAllCarts,
  getCartByUserIdAdmin,
  getCartByUserId,
  createCart,
  deleteCart,
  addItemToCart,
  removeItemFromCart,
  updateItemInCart,
  clearCart
} from "./cart.controller.js";
import authorize from "../middleware/authorize.js";
import authenticate from "../middleware/authenticate.js";
import { selfAccess } from "../middleware/accessControl.js";
import { U2000, U9550, U1234 } from "../config/roles.js";


const router = express.Router();

// User Access
router.get(
  "/user-cart",
  authenticate,
  authorize(U1234),
  selfAccess,
  getCartByUserId
);

router.post(
  "/",
  authenticate,
  authorize(U1234),
  createCart
);

router.delete(
  "/",
  authenticate,
  authorize(U1234),
  selfAccess,
  deleteCart
);

router.post(
  "/add-item",
  authenticate,
  authorize(U1234),
  selfAccess,
  addItemToCart
);

router.delete(
  "/remove-item/:productId",
  authenticate,
  authorize(U1234),
  selfAccess,
  removeItemFromCart
);

router.put(
  "/update-item/:productId",
  authenticate,
  authorize(U1234),
  selfAccess,
  updateItemInCart
);

router.delete(
  "/clear",
  authenticate,
  authorize(U1234),
  selfAccess,
  clearCart
);


// Admin access
router.get(
  "/admin/carts",
  authenticate,
  authorize(U2000, U9550),
  getAllCarts
);

router.get(
  "/admin/user-cart",
  authenticate,
  authorize(U2000, U9550),
  getCartByUserIdAdmin
);

export default router;
