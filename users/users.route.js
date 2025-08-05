import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import selfAccess from "../middleware/accessControl.js";
import { U1234 } from "../config/roles.js";
import { findUserById, updateUserPassword } from "./users.controller.js";
import { validatePasswordUpdate } from "./validate.js";

const router = Router();

// User Access
router.get(
  "/:userId",
  authenticate,
  verifyCsrfToken,
  authorize(U1234),
  selfAccess,
  findUserById
);

router.put(
  "/:userId",
  authenticate,
  verifyCsrfToken,
  authorize(U1234),
  selfAccess,
  validatePasswordUpdate,
  updateUserPassword
);

export default router;
