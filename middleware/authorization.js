const jwt = require("jsonwebtoken");
const { accessTokenSecret } = require("../config/jwt");

const authorized = (...allowedRoles) => {
  return (req, res, next) => {
    const token = req.cookies.accessToken;
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (err) return res.sendStatus(401); // Unauthorized
      const role = decoded.role;
      if (!allowedRoles.includes(role)) return res.sendStatus(403); // Forbidden

      req.user = decoded;
      next();
    });
  };
};

module.exports = authorized;
