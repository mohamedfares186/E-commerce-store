const express = require("express");
const router = express.Router();
const ordersController = require("./orders.controller");
const authorize = require("../middleware/authorization");
const accessControl = require("../middleware/accessControl");

router.get(
  "/",
  authorize("admin", "moderator"),
  accessControl.adminOrModeratorAccess,
  ordersController.getAllOrders
);

router.get(
  "/:userId",
  authorize("admin", "moderator", "user"),
  accessControl.adminOrModeratorOrUserAccess,
  ordersController.getOrderByUser
);

router.post(
  "/create-order/:userId",
  authorize("user"),
  accessControl.userAccess,
  ordersController.createOrder
);

router.put(
  "/update-order/:userId",
  authorize("admin", "moderator"),
  accessControl.adminOrModeratorAccess,
  ordersController.updateOrder
);

router.delete(
  "/delete-order/:userId",
  authorize("admin"),
  accessControl.adminAccess,
  ordersController.deleteOrder
);

module.exports = router;
