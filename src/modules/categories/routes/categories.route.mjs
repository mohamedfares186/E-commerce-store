import { Router } from "express";
import {
  retrieveAllCategories,
  retrieveOneCategories,
} from "../controllers/categories.controller.mjs";
import {
  validateCategoryQuery,
  validateCategorySlugParam,
} from "../validation/validate.mjs";

const router = Router();

router.get("/", validateCategoryQuery, retrieveAllCategories);
router.get("/:slug", validateCategorySlugParam, retrieveOneCategories);

export default router;
