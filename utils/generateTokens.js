import crypto from "crypto";
import jwt from "jsonwebtoken";
import { accessTokenSecret, refreshTokenSecret } from "../config/jwt.js";

const generateRefreshToken = (user) => {
  const token = jwt.sign(
    { username: user.username, role: user.role },
    refreshTokenSecret,
    { expiresIn: "7d" }
  );
  return token;
};

const generateAccessToken = (user) => {
  const token = jwt.sign(
    { userId: user.userId, username: user.username, role: user.role },
    accessTokenSecret,
    { expiresIn: "15m" }
  );
  return token;
};

const generateTokens = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashedToken };
};

export {
  generateRefreshToken,
  generateAccessToken,
  generateTokens
}