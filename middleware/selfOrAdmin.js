const selfOrAdmin = (req, res, next) => {
  if (!req.user) return res.sendStatus(401); // Unauthorized
  if (!req.params.id) return res.sendStatus(400); // Bad request

  const isAdmin = req.user.role === "admin";
  const isSelf = req.user._id?.toString() === req.params.id?.toString();

  if (isAdmin || isSelf) return next();

  return res.sendStatus(403); // Forbidden
};

module.exports = selfOrAdmin;
