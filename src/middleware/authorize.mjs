import { logger } from "./logger.mjs";

const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ Error: "Unauthorized" });

    const role = user.role;
    if (!allowedRoles.includes(role)) {
      logger.warn("Role access denied:", {
        userId: user.userId,
        role: user.role,
        requiredRoles: allowedRoles,
        userAgent: req.headers["user-agent"],
        ip: req.ip,
      });
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };

export default authorize;
