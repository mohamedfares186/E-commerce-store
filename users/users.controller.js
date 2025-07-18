const User = require("../auth/auth.models");
const bcrypt = require("bcryptjs");

const findAllUsers = async (req, res) => {
  const users = await User.find().select("-password -token");
  res.status(200).json(users);
};

const findOneUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id }).select("-password -token");
  res.status(200).json(user);
};

const updateUserPassword = async (req, res) => {
  const id = req.params.id;
  const { userOldPassword, newPassword, repeatedPassword } = req.body;
  if (userOldPassword === newPassword)
    return res
      .status(400)
      .json({ Error: "New password can not equal the old password" }); // can not use your old password

  const user = await User.findOne({ _id: id });
  if (!user) return res.status(404).json({ Error: "User Not Found" }); // Not Found

  const match = await bcrypt.compare(userOldPassword, user.password);

  if (!match) return res.status(400).json({ Error: "Wrong Password" }); // Bad Request

  if (newPassword !== repeatedPassword)
    return res.status(400).json({ Error: "Please enter the correct password" }); // Bad Request

  const newPasswordHash = await bcrypt.hash(repeatedPassword, 10);

  user.password = newPasswordHash;
  await user.save();
  res.sendStatus(201);
};

const deleteUser = async (req, res) => {
  const { id } = req.params.id;
  const { username } = req.body;

  if (!username)
    return res.status(400).json({ Error: "Please enter a valid username" }); // Bad Request

  const user = await User.findOne({ username: username } || { _id: id });
  if (!user) return res.status(404).json({ Error: "User Not Found" }); // Not Found

  await User.deleteOne({ username: username } || { _id: id }).exec();
  res.sendStatus(204); // No Content
};

module.exports = {
  findAllUsers,
  findOneUser,
  updateUserPassword,
  deleteUser,
};
