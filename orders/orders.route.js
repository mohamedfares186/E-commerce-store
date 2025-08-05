import { Router } from "express";
import getOrderByUserId from "./orders.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import selfAccess from "../middleware/accessControl.js";
import { U1234 } from "../config/roles.js";
import { validateOrderQuery } from "./validate.js";

const router = Router();

// User Access
router.get(
  "/user-order",
  authenticate,
  verifyCsrfToken,
  authorize(U1234),
  selfAccess,
  validateOrderQuery,
  getOrderByUserId
);

export default router;
