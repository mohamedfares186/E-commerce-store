const User = require("./auth.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: passwordHash,
      dateOfBirth: dateOfBirth,
      role: role,
    });
    await newUser.save();
    res.sendStatus(201); // created seccussfully
  } catch (error) {
    res.sendStatus(500);
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

    const refreshToken = cookies.refreshToken;
    const deleteToken = await User.deleteOne({ token });

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

module.exports = {
  register,
  login,
  refresh,
  logout,
};
