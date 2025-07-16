const jwt = require("jsonwebtoken");
const { accessTokenSecret } = require("../config/jwt");

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401); // Not Authorized

  const token = authHeader.split(" ")[1];

  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) return res.sendStatus(403); // Forbidden
    res.user = decoded;
    next();
  });
};

module.exports = verifyJwt;
