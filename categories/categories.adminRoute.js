import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import { U2000, U9550 } from "../config/roles.js";
import {
  validateCategoryCreation,
  validateCategoryDeletion,
} from "./validate.js";
import {
  createCategory,
  deleteCategory,
} from "./categories.adminController.js";

const router = Router();

// Admin Access
router.post(
  "/create-category",
  authenticate,
  verifyCsrfToken,
  authorize(U2000, U9550),
  validateCategoryCreation,
  createCategory
);

router.delete(
  "/delete-category",
  authenticate,
  verifyCsrfToken,
  authorize(U2000, U9550),
  validateCategoryDeletion,
  deleteCategory
);

export default router;
