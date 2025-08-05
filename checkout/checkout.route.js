import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import selfAccess from "../middleware/accessControl.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import { checkOut, orderVerifying } from "./checkout.controller.js";
import { validateCheckout, validateOrderVerification } from "./validate.js";

const router = Router();

router.post(
  "/",
  authenticate,
  verifyCsrfToken,
  selfAccess,
  validateCheckout,
  checkOut
);

router.get(
  "/verify-order/:token",
  authenticate,
  verifyCsrfToken,
  selfAccess,
  validateOrderVerification,
  orderVerifying
);

export default router;
