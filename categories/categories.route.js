import express from "express";
import {
  retrieveAllCategories,
  retrieveOneCategories,
  createCategory,
  deleteCategory
} from "./categories.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { U2000, U9550 } from "../config/roles.js";

const router = express.Router();

router.get("/", retrieveAllCategories);
router.get("/:slug", retrieveOneCategories);
router.post(
  "/admin/create-category",
  authenticate,
  authorize(U2000, U9550),
  createCategory
);
router.delete(
  "/admin/delete-category",
  authenticate,
  authorize(U2000, U9550),
  deleteCategory
);

export default router;
