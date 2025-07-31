import express from "express";
import { checkOut, orderVerifying } from "./checkout.controller.js";
import authenticate from "../middleware/authenticate.js";
import { selfAccess } from "../middleware/accessControl.js";

const router = express.Router();

router.post(
	"/",
	authenticate,
	selfAccess,
	checkOut
);

router.get(
	"/verify-order/:token",
	authenticate,
	selfAccess,
	orderVerifying
);


export default router;