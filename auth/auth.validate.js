const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("username").trim().notEmpty().isLength({ min: 5 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ Error: error.array() });
    next();
  },
];

const validateLogin = [
  body("username").trim().notEmpty().isLength({ min: 5 }),
  body("password").isLength({ min: 8 }),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.json({ Error: error.array() });
    next();
  },
];

module.exports = {
  validateRegister,
  validateLogin,
};
