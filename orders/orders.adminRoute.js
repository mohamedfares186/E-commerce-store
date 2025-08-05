import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import { U2000, U9550 } from "../config/roles.js";
import {
  validateAdminOrderQuery,
  validateOrderUpdate,
  validateOrderDeletion,
} from "./validate.js";
import {
  getAllOrders,
  getOrderByUserIdAdmin,
  updateOrder,
  deleteOrder,
  getOrderStats,
} from "./orders.adminController.js";

const router = Router();

// Admin Access or Moderator Access
router.get(
  "/",
  authenticate,
  verifyCsrfToken,
  authorize(U2000, U9550),
  validateAdminOrderQuery,
  getAllOrders
);

router.get(
  "/stats",
  authenticate,
  verifyCsrfToken,
  authorize(U2000, U9550),
  getOrderStats
);

router.get(
  "/user-orders",
  authenticate,
  verifyCsrfToken,
  authorize(U2000, U9550),
  validateAdminOrderQuery,
  getOrderByUserIdAdmin
);

router.put(
  "/update-order",
  authenticate,
  verifyCsrfToken,
  authorize(U2000, U9550),
  validateOrderUpdate,
  updateOrder
);

router.delete(
  "/delete-order",
  authenticate,
  verifyCsrfToken,
  authorize(U2000),
  validateOrderDeletion,
  deleteOrder
);

export default router;
