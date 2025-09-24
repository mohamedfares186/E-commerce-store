import { Router } from "express";
import authenticate from "../../../middleware/authenticate.mjs";
import authorize from "../../../middleware/authorize.mjs";
import { validateCsrfToken } from "../../../middleware/csrf.mjs";
import selfAccess from "../../../middleware/accessControl.mjs";
import {
  findAllUsers,
  findAdminProfile,
  findUserByIdAdmin,
  deleteUser,
} from "../controllers/users.adminController.mjs";
import {
  validateAdminFindUser,
  validateAdminDeleteUser,
} from "../validation/validate.mjs";

const router = Router();

// Admin Access
router.get(
  "/users",
  authenticate,
  validateCsrfToken,
  authorize("admin"),
  findAllUsers
);

router.get(
  "/get-user",
  authenticate,
  validateCsrfToken,
  authorize("admin"),
  validateAdminFindUser,
  findUserByIdAdmin
);

router.delete(
  "/delete-user",
  authenticate,
  validateCsrfToken,
  authorize("admin"),
  validateAdminDeleteUser,
  deleteUser
);

router.get(
  "/:userId",
  authenticate,
  validateCsrfToken,
  authorize("admin"),
  selfAccess,
  findAdminProfile
);

export default router;
