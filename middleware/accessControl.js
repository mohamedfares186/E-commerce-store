const adminAccess = (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401); // Unauthorized

    const isAdmin = req.user.role === "admin";

    if (isAdmin) return next();

    res.status(403).json({ Error: "Only admin can access this page" }); // Forbidden
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};

const moderatorAccess = (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401); // Unauthorized

    const isModerator = req.user.role === "moderator";

    if (isModerator) return next();

    res.status(403).json({ Error: "Only moderators can perform this task" }); // Forbidden
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};

const userAccess = (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401); // Unauthorized

    if (req.user.role === "user") return next();

    res.status(403).json({ Error: "Only users can perform this task" }); // Forbidden
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};

const adminOrModeratorAccess = (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401); // Unauthorized

    const isAdmin = req.user.role === "admin";
    const isModerator = req.user.role === "moderator";

    if (isAdmin || isModerator) return next();

    res
      .status(403)
      .json({ Error: "Only admin or moderator can perform this task" }); // Forbidden
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};

const adminOrUserAccess = (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401); // Unauthorized
    if (!req.params.id) return res.sendStatus(400); // Bad Request

    const isAdmin = req.user.role === "admin";
    const isUser = req.user.role === "user";
    // const isUser = req.user._id?.toString() === req.params.id?.toString();

    if (isAdmin || isUser) return next();

    res.status(403).json({ Error: "Access Denied" });
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};

const adminOrModeratorOrUserAccess = (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401); // Unauthorized
    if (!req.params.id) return res.sendStatus(400); // Bad Request

    const isAdmin = req.user.role === "admin";
    const isModerator = req.user.role === "moderator";
    const isUser = req.user.role === "user";
    // const isUser = req.user._id?.toString() === req.params.id?.toString();

    if (isAdmin || isModerator || isUser) return next();

    res.status(403).json({ Error: "Access Denied" });
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};

module.exports = {
  adminAccess,
  moderatorAccess,
  userAccess,
  adminOrModeratorAccess,
  adminOrUserAccess,
  adminOrModeratorOrUserAccess,
};
