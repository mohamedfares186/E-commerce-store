import { Router } from "express";
import {
  retrieveAllCategories,
  retrieveOneCategories,
} from "./categories.controller.js";
import {
  validateCategoryQuery,
  validateCategorySlugParam
} from "./validate.js";

const router = Router();

router.get("/", validateCategoryQuery, retrieveAllCategories);
router.get("/:slug", validateCategorySlugParam, retrieveOneCategories);

export default router;
