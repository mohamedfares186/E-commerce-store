import { param } from "express-validator";
import handleValidationErrors from "./validationErrorHandling.mjs";

const validateEmailVerification = [
  param("token")
    .trim()
    .notEmpty()
    .withMessage("Verification token is required")
    .isLength({ min: 20 })
    .withMessage("Invalid verification token"),

  handleValidationErrors,
];

export default validateEmailVerification;
