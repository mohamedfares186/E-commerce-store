import { cookie } from "express-validator";
import handleValidationErrors from "./validationErrorHandling.mjs";

const validateUserRefreshToken = [
  cookie("refreshToken")
    .trim()
    .notEmpty()
    .withMessage("Refresh token is required"),

  handleValidationErrors,
];

export default validateUserRefreshToken;
