import User from "../../users/models/users.model.mjs";
import bcrypt from "bcryptjs";
import generateId from "../../../utils/generateId.mjs";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
} from "../../../utils/generateTokens.mjs";
import sanitize from "../../../utils/sanitize.mjs";
import { generateCsrfToken } from "../../../middleware/csrf.mjs";
import sendEmail from "../../../utils/sendEmails.mjs";

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

    // Sanitize user input fields
    const sanitizedFirstName = sanitize(firstName);
    const sanitizedLastName = sanitize(lastName);
    const sanitizedEmail = sanitize(email);
    const sanitizedUsername = sanitize(username);

    if (
      !sanitizedFirstName ||
      !sanitizedLastName ||
      !sanitizedEmail ||
      !sanitizedUsername ||
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

    const findUser = await User.findOne({ username: sanitizedUsername });
    if (findUser) return res.status(409).json({ Error: "Invalid Credentials" }); // conflict

    const passwordHash = await bcrypt.hash(repeatPassword, 10);

    const { token, hashedToken } = generateTokens();

    const userId = generateId();

    const newUser = new User({
      userId: userId,
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      email: sanitizedEmail,
      username: sanitizedUsername,
      password: passwordHash,
      emailVerifiedToken: hashedToken,
      emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000,
      dateOfBirth: dateOfBirth,
    });

    const saved = await newUser.save();
    if (!saved) return res.status(500).json({ Error: "can not create user" }); // Internal Server Error

    const verifyLink = `http://localhost:3000/api/auth/verify-email/${token}`;

    await sendEmail(
      newUser.email,
      "Verify your Email",
      `Click this link to verify your email ${verifyLink}`
    );

    // Log the user in after registration
    const refreshToken = generateRefreshToken(newUser);
    const accessToken = generateAccessToken(newUser);
    const csrfToken = generateCsrfToken(newUser);

    await User.updateOne(
      { username: newUser.username }, // filter
      { $set: { token: refreshToken } } // update
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Change to true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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

    return res.status(201).json({
      Message:
        "User has been registered successfully, Please verify your email",
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default register;
