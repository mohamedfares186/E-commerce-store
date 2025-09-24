import { Router } from "express";
import authenticate from "../../../middleware/authenticate.mjs";
import authorize from "../../../middleware/authorize.mjs";
import { validateCsrfToken } from "../../../middleware/csrf.mjs";
import {
  validateCategoryCreation,
  validateCategoryDeletion,
} from "../validation/validate.mjs";
import {
  createCategory,
  deleteCategory,
} from "../controllers/categories.adminController.mjs";

const router = Router();

// Admin Access
router.post(
  "/create-category",
  authenticate,
  validateCsrfToken,
  authorize("admin", "moderator"),
  validateCategoryCreation,
  createCategory
);

router.delete(
  "/delete-category",
  authenticate,
  validateCsrfToken,
  authorize("admin", "moderator"),
  validateCategoryDeletion,
  deleteCategory
);

export default router;
