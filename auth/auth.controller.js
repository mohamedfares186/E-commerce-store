import User from "./auth.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import generateId from "../utils/generateId.js";
import { refreshTokenSecret } from "../config/jwt.js";
import { 
  generateAccessToken, 
  generateRefreshToken, 
  generateTokens 
} from "../utils/generateTokens.js";
import sendEmail from "../utils/sendEmails.js";


const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      repeatPassword,
      dateOfBirth,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !username ||
      !password ||
      !repeatPassword ||
      !dateOfBirth
    )
      return res.status(400).json({ Error: "Please enter valid data" }); // bad request

    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "password can not be less than 8 characters" });

    if (password !== repeatPassword) return res.sendStatus(400);

    const findUser = await User.findOne({ username: username });
    if (findUser)
      return res.status(409).json({ Error: "Invalid Credentials" }); // conflict

    const passwordHash = await bcrypt.hash(repeatPassword, 10);

    const { token, hashedToken } = generateTokens();

    const userId = generateId();

    const newUser = new User({
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: passwordHash,
      emailVerifiedToken: hashedToken,
      emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000,
      dateOfBirth: dateOfBirth,
    });
    await newUser.save();

    const verifyLink = `http://localhost:3000/api/auth/verify-email/${token}`;

    await sendEmail(
      newUser.email,
      "Verify your Email",
      `Click this link to verify your email ${verifyLink}`
    );

    return res.status(201).json({ Message: "Registered successfully, Please Verify your email" }); // created seccussfully
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const emailVerification = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerifiedToken: hashedToken,
      emailVerifyExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ Error: "Invalid or Expired token" });

    user.emailVerified = true;
    user.emailVerifiedToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();

    return res.status(200).json({ Message: "Email has been verified successfully" });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ Error: "Please enter username and password" }); // Bad Request

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ Error: "User Not Found" });

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword)
      return res.status(400).json({ Error: "Invalid Credentials" }); // Bad Request

    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);

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
    return res.sendStatus(200); // OK
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const refresh = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken)
      return res.status(403).json({ Error: "Invalid Credentials" }); // Forbidden

    const token = cookies.refreshToken;

    const findToken = await User.findOne({ token: token });
    if (!findToken)
      return res.status(404).json({ Error: "User Not Found" }); // Not Found

    jwt.verify(token, refreshTokenSecret, (err, decoded) => {
      if (err) return res.sendStatus(401); // Not Authorized
      const accessToken = generateAccessToken(decoded);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // Change to true in Production
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });
    });
    return res.status(201).json({ Message: "Token has been set successfully"}); // Created Successfully
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

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

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ Error: "Email is required" });

    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ Error: "User Not Found" });

    const { token, hashedToken } = generateTokens();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.save();
    const resetLink = `http://localhost:3000/api/auth/reset-password/${token}`;
    await sendEmail(
      email,
      "Password Reset",
      `Click the link to reset your password ${resetLink}`
    );

    return res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { newPassword, repeatPassword } = req.body;
    if (!newPassword || !repeatPassword)
      return res.status(400).json({ Error: "Password fields are required" });
    if (newPassword !== repeatPassword)
      return res.status(400).json({ Error: "Please Enter a valid password" });
    if (repeatPassword.length < 8)
      return res
        .status(400)
        .json({ Error: "Password must be at least 8 characters long" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ Error: "Invalid token" });

    const matchPasswords = await bcrypt.compare(repeatPassword, user.password);
    if (matchPasswords)
      return res.status(400).json({ Error: "Invalid Password" });

    const hashedPassword = await bcrypt.hash(repeatPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    return res.status(201).json({ Message: "Password has been set successfully" });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export {
  register,
  emailVerification,
  login,
  refresh,
  logout,
  forgetPassword,
  resetPassword,
};
