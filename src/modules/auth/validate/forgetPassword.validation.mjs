import { body } from "express-validator";
import handleValidationErrors from "./validationErrorHandling.mjs";

const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  handleValidationErrors,
];

export default validateForgotPassword;
