import User from "../../users/models/users.model.mjs";
import bcrypt from "bcryptjs";
import sanitize from "../../../utils/sanitize.mjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/generateTokens.mjs";
import { generateCsrfToken } from "../../../middleware/csrf.mjs";

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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Change to true in production
      sameSite: "strict",
      maxAge: 7 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // Change to true in production
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("X-CSRF-TOKEN", csrfToken, {
      httpOnly: true,
      secure: false, // Change to true in production
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });
    res.setHeader("X-CSRF-TOKEN", csrfToken);

    return res.sendStatus(200); // OK
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default login;
