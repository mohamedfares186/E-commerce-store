import User from "../../users/models/users.model.mjs";

const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken)
      return res.status(403).json({ Error: "Invalid Credentials" }); // Forbidden

    const token = cookies.refreshToken;
    await User.updateOne({ token: token }, { $set: { token: "" } });

    const deleteToken = await User.deleteOne({ token });
    if (!deleteToken) return res.status(404).json({ Error: "User Not Found" }); // Not Found

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false, // Change to true in production
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // Change to true in production
      sameSite: "strict",
    });
    return res.sendStatus(204); // No Content
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default logout;
