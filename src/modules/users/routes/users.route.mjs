import { Router } from "express";
import authenticate from "../../../middleware/authenticate.mjs";
import authorize from "../../../middleware/authorize.mjs";
import { validateCsrfToken } from "../../../middleware/csrf.mjs";
import selfAccess from "../../../middleware/accessControl.mjs";
import {
  findUserById,
  updateUserPassword,
} from "../controllers/users.controller.mjs";
import { validatePasswordUpdate } from "../validation/validate.mjs";

const router = Router();

// User Access
router.get(
  "/:userId",
  authenticate,
  validateCsrfToken,
  authorize("user"),
  selfAccess,
  findUserById
);

router.put(
  "/:userId",
  authenticate,
  validateCsrfToken,
  authorize("user"),
  selfAccess,
  validatePasswordUpdate,
  updateUserPassword
);

export default router;
