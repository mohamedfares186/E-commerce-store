import { cookie } from "express-validator";
import handleValidationErrors from "./validationErrorHandling.mjs";

const validateUserLogout = [
  cookie("refreshToken")
    .trim()
    .notEmpty()
    .withMessage("Refresh token is required"),

  handleValidationErrors,
];

export default validateUserLogout;
