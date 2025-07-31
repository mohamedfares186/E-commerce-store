import express from "express";
import { 
	register, 
	emailVerification, 
	login, 
	refresh, 
	logout, 
	forgetPassword, 
	resetPassword 
} from "./auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.get("/verify-email/:token", emailVerification);
router.post("/login", login);
router.get("/refresh", refresh);
router.post("/logout", logout);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
