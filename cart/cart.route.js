const express = require("express");
const router = express.Router();
const cartController = require("./cart.controller");
const authorize = require("../middleware/authorization");
const accessControl = require("../middleware/accessControl");

router.get(
  "/",
  authorize("admin", "moderator"),
  accessControl.adminOrModeratorAccess,
  cartController.getAllCarts
);

router.get(
  "/:id",
  authorize("admin", "moderator", "user"),
  accessControl.adminOrModeratorOrUserAccess,
  cartController.getCartByUserId
);

router.post(
  "/",
  authorize("user"),
  accessControl.userAccess,
  cartController.createCart
);

router.delete(
  "/",
  authorize("user"),
  accessControl.userAccess,
  cartController.deleteCart
);

router.post(
  "/add-item",
  authorize("user"),
  accessControl.userAccess,
  cartController.addItemToCart
);

router.delete(
  "/remove-item/:productId",
  authorize("user"),
  accessControl.userAccess,
  cartController.removeItemFromCart
);

router.put(
  "/update-item/:productId",
  authorize("user"),
  accessControl.userAccess,
  cartController.updateItemInCart
);

router.delete(
  "/clear",
  authorize("user"),
  accessControl.userAccess,
  cartController.clearCart
);

module.exports = router;
