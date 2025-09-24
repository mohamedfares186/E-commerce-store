import jwt from "jsonwebtoken";
import env from "../config/env.mjs";

const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) return res.sendStatus(401);
    jwt.verify(token, env.accessTokenSecret, (err, decoded) => {
      if (err) return res.status(403).json({ Error: "Access Denied" });
      const role = decoded.role;
      if (!allowedRoles.includes(role))
        return res.status(403).json({ Error: "Access Denied" });
      req.user = decoded;
      next();
    });
  };

export default authorize;
