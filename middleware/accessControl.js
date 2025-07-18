const adminAccess = (req, res, next) => {
  if (!req.user) return res.sendStatus(401); // Unauthorized

  const isAdmin = req.user.role === "admin";

  if (isAdmin) return next();

  res.status(403).json({ Error: "Only admin can access this page" }); // Forbidden
};

const moderatorAccess = (req, res, next) => {
  if (!req.user) return res.sendStatus(401); // Unauthorized

  const isModerator = req.user.role === "moderator";

  if (isModerator) return next();

  res.status(403).json({ Error: "Only moderators can perform this task" }); // Forbidden
};

const userAccess = (req, res, next) => {
  if (!req.user) return res.sendStatus(401); //Unauthorized
  if (!req.params.id) return res.sendStatus(400); // Bad Request

  const isSelf = req.user._id?.toString() === req.params.id?.toString();

  if (isSelf) return next();

  res.sendStatus(403); // Forbidden
};

const adminOrModeratorAccess = (req, res, next) => {
  if (!req.user) return res.sendStatus(401); // Unauthorized

  const isAdmin = req.user.role === "admin";
  const isModerator = req.user.role === "moderator";

  if (isAdmin || isModerator) return next();

  res
    .status(403)
    .json({ Error: "Only admin or moderator can perform this task" }); // Forbidden
};

const adminOrUserAccess = (req, res, next) => {
  if (!req.user) return res.sendStatus(401); // Unauthorized
  if (!req.params.id) return res.sendStatus(400); // Bad Request

  const isAdmin = req.user.role === "admin";
  const isUser = req.user._id?.toString() === req.params.id?.toString();

  if (isAdmin || isUser) return next();

  res.status(403).json({ Error: "Access Denied" });
};

module.exports = {
  adminAccess,
  moderatorAccess,
  userAccess,
  adminOrModeratorAccess,
  adminOrUserAccess,
};
