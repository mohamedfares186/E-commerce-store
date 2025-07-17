const express = require("express");
const router = express.Router();
const userAuthentication = require("./auth.controller");
const validateUserInput = require("./auth.validate");

router.post(
  "/register",
  validateUserInput.validateRegister,
  userAuthentication.register
);
router.post(
  "/login",
  validateUserInput.validateLogin,
  userAuthentication.login
);
router.get("/refresh", userAuthentication.refresh);
router.post("/logout", userAuthentication.logout);

module.exports = router;
