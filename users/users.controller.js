import User from "../auth/auth.models.js";
import bcrypt from "bcryptjs";


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

const findUserByIdAdmin = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username }).select("-password -token -_id -__v");
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
    if (!userId) return res.status(401).json({ Error: "Access Denied" })

    const { username } = req.params;
    if (!username)
      return res.status(400).json({ Error: "Please enter a valid username" }); // Bad Request

    const user = await User.findOne({ username: username });
    if (!user) return res.status(404).json({ Error: "User Not Found" }); // Not Found

    await User.deleteOne({ username: user.username }).exec();
    return res.sendStatus(204); // No Content
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};


// User Access
const findUserById = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findOne({ userId: userId }).select("-password -token -_id -__v");
    if (!user) return res.status(404).json({ Error: "User Not Found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { userOldPassword, newPassword, repeatPassword } = req.body;
    if (userOldPassword === newPassword)
      return res
        .status(400)
        .json({ Error: "New password can not equal the old password" }); // can not use your old password

    const user = await User.findOne({ userId: userId });
    if (!user) return res.status(404).json({ Error: "User Not Found" }); // Not Found

    const match = await bcrypt.compare(userOldPassword, user.password);

    if (!match) return res.status(400).json({ Error: "Wrong Password" }); // Bad Request

    if (newPassword !== repeatPassword)
      return res
        .status(400)
        .json({ Error: "Please enter the correct password" }); // Bad Request

    const newPasswordHash = await bcrypt.hash(repeatPassword, 10);

    user.password = newPasswordHash;
    await user.save();
    return res.status(200).json({ Message: "Password has been updated successfully" });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export {
  findAllUsers,
  findUserByIdAdmin,
  deleteUser,
  findUserById,
  updateUserPassword,
};
