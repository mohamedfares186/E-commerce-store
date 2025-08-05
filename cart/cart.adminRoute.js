import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import { U2000, U9550 } from "../config/roles.js";
import filter from "../middleware/filter.js";
import pagination from "../middleware/pagination.js";
import { validateGetCartAdmin } from "./validate.js";
import { getAllCarts, getCartByUserIdAdmin } from "./cart.adminController.js";

const router = Router();
const cartFilter = filter(["createdAt", "cartId", "user"]);

// Admin access
router.get(
  "/",
  authenticate,
  verifyCsrfToken,
  authorize(U2000, U9550),
  cartFilter,
  pagination,
  getAllCarts
);

router.get(
  "/user-cart",
  authenticate,
  verifyCsrfToken,
  authorize(U2000, U9550),
  validateGetCartAdmin,
  getCartByUserIdAdmin
);

export default router;
