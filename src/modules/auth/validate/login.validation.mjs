import { body } from "express-validator";
import handleValidationErrors from "./validationErrorHandling.mjs";

const validateUserLogin = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 1 })
    .withMessage("Password cannot be empty"),

  handleValidationErrors,
];

export default validateUserLogin;
