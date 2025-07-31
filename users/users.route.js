import express from "express";
import { 
  findAllUsers, 
  findUserById, 
  findUserByIdAdmin,
  updateUserPassword, 
  deleteUser 
} from "./users.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { selfAccess } from "../middleware/accessControl.js";
import { U2000, U1234 } from "../config/roles.js";

const router = express.Router();


// Admin Access
router.get(
  "/admin/users", 
  authenticate, 
  authorize(U2000), 
  findAllUsers
);

router.get(
  "/admin/:username",
  authenticate,
  authorize(U2000),
  findUserByIdAdmin
);

router.delete(
  "/admin/:username",
 authenticate, 
 authorize(U2000), 
 deleteUser
);

// User Access
router.get(
  "/:userId",
  authenticate,
  authorize(U1234),
  selfAccess,
  findUserById
);

router.put(
  "/:userId",
  authenticate,
  authorize(U1234),
  updateUserPassword
);

export default router;
