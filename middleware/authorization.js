const jwt = require("jsonwebtoken");
const { accessTokenSecret } = require("../config/jwt");

const authorized = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.cookies.accessToken) return res.sendStatus(401); // Unauthorized
      const token = req.cookies.accessToken;
      jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) return res.status(403).json({ Error: "Access Denied" }); // Forbidden
        const role = decoded.role;
        if (!allowedRoles.includes(role))
          return res.status(403).json({ Error: "Access Denied" }); // Forbidden
        req.user = decoded;
        next();
      });
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  };
};

module.exports = authorized;
