const selfAccess = (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401); // Unauthorized

    if (req.params.userId) {
      if (req.user.userId === req.params.userId) {
        return next();
      } else {
        return res.status(403).json({ Error: "Access Denied345" });
      }
    }

    return next()
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default selfAccess;

