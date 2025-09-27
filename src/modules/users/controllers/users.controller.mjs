import User from "../models/users.model.mjs";
import bcrypt from "bcryptjs";
import { logger } from "../../../middleware/logger.mjs";


// User Access
const findUserById = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findOne({ userId: userId }).select(
      "-password -token -_id -__v"
    );
    if (!user) return res.status(404).json({ Error: "User Not Found" });
    return res.status(200).json(user);
  } catch (error) {
    logger.error("Error finding user by ID: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
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
    return res
      .status(200)
      .json({ Message: "Password has been updated successfully" });
  } catch (error) {
    logger.error("Error updating user password:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { findUserById, updateUserPassword };
