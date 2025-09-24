import { Router } from "express";

// Controllers
import register from "../controllers/register.controller.mjs";
import login from "../controllers/login.controller.mjs";
import logout from "../controllers/logout.controller.mjs";
import emailVerification from "../controllers/email.controller.mjs";
import refresh from "../controllers/refresh.controller.mjs";
import forgetPassword from "../controllers/forgetPassword.controller.mjs";
import resetPassword from "../controllers/resetPassword.controller.mjs";

// Validations
import validateUserRegistration from "../validate/register.validation.mjs";
import validateUserLogin from "../validate/login.validation.mjs";
import validateUserLogout from "../validate/logout.validation.mjs";
import validateEmailVerification from "../validate/email.validation.mjs";
import validateUserRefreshToken from "../validate/refresh.validation.mjs";
import validateForgotPassword from "../validate/forgetPassword.validation.mjs";
import validateResetPassword from "../validate/resetPassword.validation.mjs";

const router = Router();

router.post("/register", validateUserRegistration, register);
router.post("/login", validateUserLogin, login);
router.post("/logout", validateUserLogout, logout);
router.post(
  "/verify-email/:token",
  validateEmailVerification,
  emailVerification
);
router.post("/refresh", validateUserRefreshToken, refresh);
router.post("/forget-password", validateForgotPassword, forgetPassword);
router.post("/reset-password/:token", validateResetPassword, resetPassword);

export default router;
