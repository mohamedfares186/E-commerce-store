const express = require("express");
const router = express.Router();
const categoriesController = require("./categories.controller");
const authorize = require("../middleware/authorization");
const accessControl = require("../middleware/accessControl");

router.get("/", categoriesController.retrieveAllCategories);
router.get("/:slug", categoriesController.retrieveOneCategories);
router.post(
  "/create-category",
  authorize("admin", "moderator"),
  accessControl.adminOrModeratorAccess,
  categoriesController.createCategory
);
router.delete(
  "/:slug",
  authorize("admin", "moderator"),
  accessControl.adminOrModeratorAccess,
  categoriesController.deleteCategory
);

module.exports = router;
