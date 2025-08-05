import { Router } from "express";
import authorize from "../middleware/authorize.js";
import authenticate from "../middleware/authenticate.js";
import selfAccess from "../middleware/accessControl.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import { U1234 } from "../config/roles.js";
import {
  validateCreateCart,
  validateAddItemToCart,
  validateRemoveCartItem,
  validateUpdateCartItem,
} from "./validate.js";
import {
  getCartByUserId,
  createCart,
  deleteCart,
  addItemToCart,
  removeItemFromCart,
  updateItemInCart,
  clearCart,
} from "./cart.controller.js";

const router = Router();

// User Access
router.get(
  "/user-cart",
  authenticate,
  verifyCsrfToken,
  authorize(U1234),
  selfAccess,
  getCartByUserId
);

router.post(
  "/",
  authenticate,
  verifyCsrfToken,
  authorize(U1234),
  validateCreateCart,
  createCart
);

router.delete(
  "/",
  authenticate,
  verifyCsrfToken,
  authorize(U1234),
  selfAccess,
  deleteCart
);

router.post(
  "/add-item",
  authenticate,
  verifyCsrfToken,
  authorize(U1234),
  selfAccess,
  validateAddItemToCart,
  addItemToCart
);

router.delete(
  "/remove-item/:productId",
  authenticate,
  verifyCsrfToken,
  authorize(U1234),
  selfAccess,
  validateRemoveCartItem,
  removeItemFromCart
);

router.put(
  "/update-item/:productId",
  authenticate,
  verifyCsrfToken,
  authorize(U1234),
  selfAccess,
  validateUpdateCartItem,
  updateItemInCart
);

router.delete(
  "/clear",
  authenticate,
  verifyCsrfToken,
  authorize(U1234),
  selfAccess,
  clearCart
);

export default router;
