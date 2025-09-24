import User from "../../users/models/users.model.mjs";
import jwt from "jsonwebtoken";
import env from "../../../config/env.mjs";
import { generateAccessToken } from "../../../utils/generateTokens.mjs";

const refresh = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken)
      return res.status(403).json({ Error: "Invalid Credentials" }); // Forbidden

    const token = cookies.refreshToken;

    const findToken = await User.findOne({ token: token });
    if (!findToken) return res.status(404).json({ Error: "User Not Found" }); // Not Found

    jwt.verify(token, env.refreshTokenSecret, (err, decoded) => {
      if (err) return res.sendStatus(401); // Not Authorized
      const accessToken = generateAccessToken(decoded);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // Change to true in Production
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });
    });
    return res.status(201).json({ Message: "Token has been set successfully" }); // Created Successfully
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default refresh;
