import User from "../models/users.model.mjs";
import sanitize from "../../../utils/sanitize.mjs";

// Admin Access
const findAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -token -_id -__v");
    if (!users) return res.status(404).json({ Error: "No users Found" });
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
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
    console.error(error);
    return res.sendStatus(500);
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
    console.error(error);
    return res.sendStatus(500);
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
      return res.status(400).json({ Error: "Please enter a valid username" }); // Bad Request

    const user = await User.findOne({ username: sanitizedUsername });
    if (!user) return res.status(404).json({ Error: "User Not Found" }); // Not Found

    await User.deleteOne({ username: user.username }).exec();
    return res.sendStatus(204); // No Content
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export { findAllUsers, findAdminProfile, findUserByIdAdmin, deleteUser };
