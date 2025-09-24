import { Router } from "express";
import authenticate from "../../../middleware/authenticate.mjs";
import authorize from "../../../middleware/authorize.mjs";
import { validateCsrfToken } from "../../../middleware/csrf.mjs";
import {
  validateAdminOrderQuery,
  validateOrderUpdate,
  validateOrderDeletion,
} from "../validation/validate.mjs";
import {
  getAllOrders,
  getOrderByUserIdAdmin,
  updateOrder,
  deleteOrder,
  getOrderStats,
} from "../controllers/orders.adminController.mjs";

const router = Router();

// Admin Access or Moderator Access
router.get(
  "/",
  authenticate,
  validateCsrfToken,
  authorize("admin", "moderator"),
  validateAdminOrderQuery,
  getAllOrders
);

router.get(
  "/stats",
  authenticate,
  validateCsrfToken,
  authorize("admin", "moderator"),
  getOrderStats
);

router.get(
  "/user-orders",
  authenticate,
  validateCsrfToken,
  authorize("admin", "moderator"),
  validateAdminOrderQuery,
  getOrderByUserIdAdmin
);

router.put(
  "/update-order",
  authenticate,
  validateCsrfToken,
  authorize("admin", "moderator"),
  validateOrderUpdate,
  updateOrder
);

router.delete(
  "/delete-order",
  authenticate,
  validateCsrfToken,
  authorize("admin"),
  validateOrderDeletion,
  deleteOrder
);

export default router;
