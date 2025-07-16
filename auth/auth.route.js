const express = require("express");
const router = express.Router();
const userAuthentication = require("./auth.controller");

router.post("/register", userAuthentication.register);
router.post("/login", userAuthentication.login);
router.get("/refresh", userAuthentication.refresh);
router.post("/logout", userAuthentication.logout);

module.exports = router;
