const User = require("./auth.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { accessTokenSecret, refreshTokenSecret } = require("../config/jwt");

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
    { _id: user._id, username: user.username, role: user.role },
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

const sendEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Email sending failed");
    }
    console.log("Email sent:", info.response);
  });
};

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      reEnterPassword,
      dateOfBirth,
      role,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !username ||
      !password ||
      !reEnterPassword ||
      !dateOfBirth
    )
      return res.status(400).json({ Error: "Please enter valid data" }); // bad request

    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "password can not be less than 8 characters" });

    if (password !== reEnterPassword) return res.sendStatus(400);

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(409).json({ Error: "Invalid Credentials" }); // conflict

    const passwordHash = await bcrypt.hash(reEnterPassword, 10);

    const { token, hashedToken } = generateTokens();

    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: passwordHash,
      emailVerifiedToken: hashedToken,
      emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000,
      dateOfBirth: dateOfBirth,
      role: role,
    });
    await newUser.save();

    const verifyLink = `http://localhost:3000/api/auth/verify-email/${token}`;

    await sendEmail(
      newUser.email,
      "Verify your Email",
      `Click this link to verify your email ${verifyLink}`
    );

    res
      .status(201)
      .json({ Message: "Registered successfully, Please Verify your email" }); // created seccussfully
  } catch (error) {
    res.sendStatus(500);
  }
};

const emailVerification = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token)
      return res.status(400).json({ Error: "Verification token is required" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerifiedToken: hashedToken,
      emailVerifyExpires: { $gt: Date.now() },
    });

    console.log(user);

    if (!user)
      return res.status(400).json({ Error: "Invalid or Expired token" });

    user.emailVerified = true;
    user.emailVerifiedToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();

    res.status(200).json({ Message: "Email has been verified successfully" });
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
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

    const role = user.role;

    const refreshToken = generateRefreshToken(user);

    await User.updateOne(
      { username: user.username }, // filter
      { $set: { token: refreshToken } } // update
    );

    const accessToken = generateAccessToken(user);

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
    res.sendStatus(200); // OK
  } catch (error) {
    res.sendStatus(500);
  }
};

const refresh = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken)
      return res.status(403).json({ Error: "Invalid Credentials" }); // Forbidden

    const token = cookies.refreshToken;

    const retrieveToken = await User.findOne({ token });
    if (!retrieveToken)
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
    res.sendStatus(201); // Created Successfully
  } catch (error) {
    res.sendStatus(500);
  }
};

const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken)
      return res.status(403).json({ Error: "Invalid Credentials" }); // Forbidden

    const token = cookies.refreshToken;
    await User.updateOne({ token }, { $set: { token: "" } });

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
    res.sendStatus(204); // No Content
  } catch (error) {
    res.sendStatus(500);
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

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token)
      return res.status(400).json({ Error: "reset token is required" });

    const { newPassword, repeatPassword } = req.body;
    if ((!newPassword, !repeatPassword))
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

    const matchPasswords = bcrypt.compare(repeatPassword, user.password);
    if (matchPasswords)
      return res.status(400).json({ Error: "Invalid Password" });

    const hashedPassword = await bcrypt.hash(repeatPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(201).json({ Message: "Password has been set successfully" });
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

module.exports = {
  register,
  emailVerification,
  login,
  refresh,
  logout,
  forgetPassword,
  resetPassword,
};
