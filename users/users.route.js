const express = require("express");
const router = express.Router();
const usersController = require("./users.controller");
const authorize = require("../middleware/authorization");
const selfOrAdmin = require("../middleware/selfOrAdmin");

router.get("/", authorize("admin"), usersController.findAllUsers);
router.get(
  "/:id",
  authorize("admin", "user"),
  selfOrAdmin,
  usersController.findOneUser
);
router.put(
  "/:id",
  authorize("admin", "user"),
  selfOrAdmin,
  usersController.updateUserPassword
);
router.delete("/:id", authorize("admin"), usersController.deleteUser);

module.exports = router;
