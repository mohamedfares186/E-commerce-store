import jwt from "jsonwebtoken";
import env from "../config/env.mjs";

const authenticate = (req, res, next) => {
  const token = req.cookies["x-access-token"];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = jwt.verify(token, env.accessTokenSecret);
  if (!decoded) return res.status(403).json({ error: "Forbidden" });

  req.user = decoded;
  return next();
};

export default authenticate;
