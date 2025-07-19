const express = require("express");
const router = express.Router();
const productController = require("./products.controller");
const authorize = require("../middleware/authorization");
const accessControl = require("../middleware/accessControl");

router.get("/", productController.retrieveAllProducts);
router.get("/search", productController.retrieveProductsByCategory);
router.get("/:id", productController.retrieveProductById);
router.post(
  "/create-product",
  authorize("admin", "moderator"),
  accessControl.adminOrModeratorAccess,
  productController.createProduct
);
router.delete(
  "/delete-product",
  authorize("admin", "moderator"),
  accessControl.adminOrModeratorAccess,
  productController.deleteProduct
);

module.exports = router;
