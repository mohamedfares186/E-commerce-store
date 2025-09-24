import { Router } from "express";
import authenticate from "../../../middleware/authenticate.mjs";
import authorize from "../../../middleware/authorize.mjs";
import { validateCsrfToken } from "../../../middleware/csrf.mjs";
import filter from "../../../middleware/filter.mjs";
import pagination from "../../../middleware/pagination.mjs";
import { validateGetCartAdmin } from "../validation/validate.mjs";
import {
  getAllCarts,
  getCartByUserIdAdmin,
} from "../controllers/cart.adminController.mjs";

const router = Router();
const cartFilter = filter(["createdAt", "cartId", "user"]);

// Admin access
router.get(
  "/",
  authenticate,
  validateCsrfToken,
  authorize("admin", "moderator"),
  cartFilter,
  pagination,
  getAllCarts
);

router.get(
  "/user-cart",
  authenticate,
  validateCsrfToken,
  authorize("admin", "moderator"),
  validateGetCartAdmin,
  getCartByUserIdAdmin
);

export default router;
