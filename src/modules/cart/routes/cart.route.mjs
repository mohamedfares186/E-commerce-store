import { Router } from "express";
import authorize from "../../../middleware/authorize.mjs";
import authenticate from "../../../middleware/authenticate.mjs";
import selfAccess from "../../../middleware/accessControl.mjs";
import { validateCsrfToken } from "../../../middleware/csrf.mjs";
import {
  validateCreateCart,
  validateAddItemToCart,
  validateRemoveCartItem,
  validateUpdateCartItem,
} from "../validation/validate.mjs";
import {
  getCartByUserId,
  createCart,
  deleteCart,
  addItemToCart,
  removeItemFromCart,
  updateItemInCart,
  clearCart,
} from "../controllers/cart.controller.mjs";

const router = Router();

// User Access
router.get(
  "/user-cart",
  authenticate,
  validateCsrfToken,
  authorize("user"),
  selfAccess,
  getCartByUserId
);

router.post(
  "/",
  authenticate,
  validateCsrfToken,
  authorize("user"),
  validateCreateCart,
  createCart
);

router.delete(
  "/",
  authenticate,
  validateCsrfToken,
  authorize("user"),
  selfAccess,
  deleteCart
);

router.post(
  "/add-item",
  authenticate,
  validateCsrfToken,
  authorize("user"),
  selfAccess,
  validateAddItemToCart,
  addItemToCart
);

router.delete(
  "/remove-item/:productId",
  authenticate,
  validateCsrfToken,
  authorize("user"),
  selfAccess,
  validateRemoveCartItem,
  removeItemFromCart
);

router.put(
  "/update-item/:productId",
  authenticate,
  validateCsrfToken,
  authorize("user"),
  selfAccess,
  validateUpdateCartItem,
  updateItemInCart
);

router.delete(
  "/clear",
  authenticate,
  validateCsrfToken,
  authorize("user"),
  selfAccess,
  clearCart
);

export default router;
