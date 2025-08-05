import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import selfAccess from "../middleware/accessControl.js";
import { U2000 } from "../config/roles.js";
import {
  findAllUsers,
  findAdminProfile,
  findUserByIdAdmin,
  deleteUser,
} from "./users.adminController.js";
import { validateAdminFindUser, validateAdminDeleteUser } from "./validate.js";

const router = Router();

// Admin Access
router.get(
  "/users",
  authenticate,
  verifyCsrfToken,
  authorize(U2000),
  findAllUsers
);

router.get(
  "/get-user",
  authenticate,
  verifyCsrfToken,
  authorize(U2000),
  validateAdminFindUser,
  findUserByIdAdmin
);

router.delete(
  "/delete-user",
  authenticate,
  verifyCsrfToken,
  authorize(U2000),
  validateAdminDeleteUser,
  deleteUser
);

router.get(
  "/:userId", 
  authenticate, 
  verifyCsrfToken, 
  authorize(U2000), 
  selfAccess, 
  findAdminProfile
);


export default router;
