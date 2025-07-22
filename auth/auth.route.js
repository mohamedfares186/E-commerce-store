const express = require("express");
const router = express.Router();
const userAuthentication = require("./auth.controller");

router.post("/register", userAuthentication.register);
router.get("/verify-email/:token", userAuthentication.emailVerification);
router.post("/login", userAuthentication.login);
router.get("/refresh", userAuthentication.refresh);
router.post("/logout", userAuthentication.logout);
router.post("/forget-password", userAuthentication.forgetPassword);
router.post("/reset-password/:token", userAuthentication.resetPassword);

module.exports = router;
