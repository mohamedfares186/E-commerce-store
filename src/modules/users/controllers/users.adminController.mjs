import User from "../models/users.model.mjs";
import sanitize from "../../../utils/sanitize.mjs";
import { logger } from "../../../middleware/logger.mjs";

// Admin Access
const findAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -token -_id -__v");
    if (!users) return res.status(404).json({ Error: "No users Found" });
    return res.status(200).json(users);
  } catch (error) {
    logger.error("Error retrieving all users: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const findAdminProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId: userId }).select(
      "-password -token -_id -__v"
    );
    if (!user) return res.status(404).json({ Error: "User Not Found" });

    return res.status(200).json(user);
  } catch (error) {
    logger.error("Error retrieving admin profile: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const findUserByIdAdmin = async (req, res) => {
  try {
    const { username } = req.body;

    // Sanitize username input
    const sanitizedUsername = sanitize(username);

    const user = await User.findOne({ username: sanitizedUsername }).select(
      "-password -token -_id -__v"
    );
    if (!user) return res.status(404).json({ Error: "User Not Found" });
    return res.status(200).json(user);
  } catch (error) {
    logger.error("Error admin finding a user by ID: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) return res.status(401).json({ Error: "Access Denied" });

    const { username } = req.body;

    // Sanitize username input
    const sanitizedUsername = sanitize(username);

    if (!sanitizedUsername)
      return res.status(400).json({ Error: "Please enter a valid username" });

    const user = await User.findOne({ username: sanitizedUsername });
    if (!user) return res.status(404).json({ Error: "User Not Found" });

    await User.deleteOne({ username: user.username }).exec();
    return res.sendStatus(204);
  } catch (error) {
    logger.error("Error deleting a user: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { findAllUsers, findAdminProfile, findUserByIdAdmin, deleteUser };
