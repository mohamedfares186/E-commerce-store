import express from "express";
import {
  getAllOrders,
  getOrderByUserId,
  getOrderByUserIdAdmin,
  deleteOrder,
  updateOrder,
  getOrderStats
} from "./orders.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { selfAccess } from "../middleware/accessControl.js";
import { U2000, U9550, U1234 } from "../config/roles.js";

const router = express.Router();

// Admin Access or Moderator Access
router.get(
  "/",
  authenticate,
  authorize(U2000, U9550),
  getAllOrders
);

router.get(
  "/admin/stats",
  authenticate,
  authorize(U2000, U9550),
  getOrderStats
);

router.get(
  "/admin/user-orders",
  authenticate,
  authorize(U2000, U9550),
  getOrderByUserIdAdmin
);

router.put(
  "/admin/update-order/:username",
  authenticate,
  authorize(U2000, U9550),
  updateOrder
);

router.delete(
  "/admin/delete-order",
  authenticate,
  authorize(U2000),
  deleteOrder
);

// User Access
router.get(
  "/user-order",
  authenticate,
  authorize(U1234),
  selfAccess,
  getOrderByUserId
);

export default router;
