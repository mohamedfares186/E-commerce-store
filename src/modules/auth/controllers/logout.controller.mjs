import User from "../../users/models/users.model.mjs";
import { logger } from "../../../middleware/logger.mjs";
import env from "../../../config/env.mjs";

const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken)
      return res.status(403).json({ Error: "Invalid Credentials" });

    const token = cookies.refreshToken;
    await User.updateOne({ token: token }, { $set: { token: "" } });

    const deleteToken = await User.deleteOne({ token });
    if (!deleteToken) return res.status(404).json({ Error: "User Not Found" });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: env.env === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.env === "production",
      sameSite: "strict",
    });
    return res.sendStatus(204);
  } catch (error) {
    logger.error("Error log user out: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default logout;
