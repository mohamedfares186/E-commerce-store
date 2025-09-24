import { Router } from "express";
import authenticate from "../../../middleware/authenticate.mjs";
import selfAccess from "../../../middleware/accessControl.mjs";
import { validateCsrfToken } from "../../../middleware/csrf.mjs";
import {
  checkOut,
  orderVerifying,
} from "../controllers/checkout.controller.mjs";
import {
  validateCheckout,
  validateOrderVerification,
} from "../validation/validate.mjs";

const router = Router();

router.post(
  "/",
  authenticate,
  validateCsrfToken,
  selfAccess,
  validateCheckout,
  checkOut
);

router.get(
  "/verify-order/:token",
  authenticate,
  validateCsrfToken,
  selfAccess,
  validateOrderVerification,
  orderVerifying
);

export default router;
