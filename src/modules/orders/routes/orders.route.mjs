import { Router } from "express";
import getOrderByUserId from "../controllers/orders.controller.mjs";
import authenticate from "../../../middleware/authenticate.mjs";
import authorize from "../../../middleware/authorize.mjs";
import { validateCsrfToken } from "../../../middleware/csrf.mjs";
import selfAccess from "../../../middleware/accessControl.mjs";
import { validateOrderQuery } from "../validation/validate.mjs";

const router = Router();

// User Access
router.get(
  "/user-order",
  authenticate,
  validateCsrfToken,
  authorize("user"),
  selfAccess,
  validateOrderQuery,
  getOrderByUserId
);

export default router;
