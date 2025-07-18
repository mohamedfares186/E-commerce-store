const express = require("express");
const router = express.Router();
const usersController = require("./users.controller");
const authorize = require("../middleware/authorization");
const accessControl = require("../middleware/accessControl");

router.get("/", authorize("admin"), usersController.findAllUsers);
router.get(
  "/:id",
  authorize("admin", "user"),
  accessControl.adminOrUserAccess,
  usersController.findOneUser
);
router.put(
  "/:id",
  authorize("admin", "user"),
  accessControl.adminOrUserAccess,
  usersController.updateUserPassword
);
router.delete("/:id", authorize("admin"), usersController.deleteUser);

module.exports = router;
