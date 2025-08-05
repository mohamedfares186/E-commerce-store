import { Router } from "express";
import {
  register,
  emailVerification,
  login,
  refresh,
  logout,
  forgetPassword,
  resetPassword,
} from "./auth.controller.js";
import {
  validateUserRegistration,
  validateUserLogin,
  validateUserRefreshToken,
  validateUserLogout,
  validateForgotPassword,
  validateResetPassword,
  validateEmailVerification,
} from "./validate.js";

const router = Router();

router.post("/register", validateUserRegistration, register);
router.get(
  "/verify-email/:token",
  validateEmailVerification,
  emailVerification
);
router.post("/login", validateUserLogin, login);
router.get("/refresh", validateUserRefreshToken, refresh);
router.post("/logout", validateUserLogout, logout);
router.post("/forget-password", validateForgotPassword, forgetPassword);
router.post("/reset-password/:token", validateResetPassword, resetPassword);

export default router;
