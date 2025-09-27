import User from "../../users/models/users.model.mjs";
import bcrypt from "bcryptjs";
import sanitize from "../../../utils/sanitize.mjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/generateTokens.mjs";
import { generateCsrfToken } from "../../../middleware/csrf.mjs";
import { logger } from "../../../middleware/logger.mjs";
import env from "../../../config/env.mjs";

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Sanitize username input
    const sanitizedUsername = sanitize(username);

    if (!sanitizedUsername || !password)
      return res
        .status(400)
        .json({ Error: "Please enter username and password" }); // Bad Request

    const user = await User.findOne({ username: sanitizedUsername });
    if (!user) return res.status(404).json({ Error: "User Not Found" });

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword)
      return res.status(400).json({ Error: "Invalid Credentials" }); // Bad Request

    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);
    const csrfToken = generateCsrfToken(user);

    await User.updateOne(
      { username: user.username }, // filter
      { $set: { token: refreshToken } } // update
    );

    res.cookie("x-refresh-token", refreshToken, {
      httpOnly: true,
      secure: env.env === "production",
      sameSite: "strict",
      maxAge: 7 * 60 * 60 * 1000,
    });
    res.cookie("x-access-token", accessToken, {
      httpOnly: true,
      secure: env.env === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("x-csrf-token", csrfToken, {
      httpOnly: true,
      secure: env.env === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });
    res.setHeader("x-csrf-token", csrfToken);

    return res.sendStatus(200);
  } catch (error) {
    logger.error("Error log user in: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default login;
