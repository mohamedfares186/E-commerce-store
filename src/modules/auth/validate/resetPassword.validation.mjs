import { body, param } from "express-validator";
import handleValidationErrors from "./validationErrorHandling.mjs";

const validateResetPassword = [
  param("token")
    .trim()
    .notEmpty()
    .withMessage("Reset token is required")
    .isLength({ min: 20 })
    .withMessage("Invalid reset token"),

  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8, max: 128 })
    .withMessage("New password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("repeatPassword")
    .trim()
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  handleValidationErrors,
];

export default validateResetPassword;
