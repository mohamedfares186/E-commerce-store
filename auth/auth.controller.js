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
    { username: user.username, role: user.role },
    accessTokenSecret,
    { expiresIn: "15m" }
  );
  return token;
};

const register = async (req, res) => {
  const { firstName, lastName, email, username, password, dateOfBirth, role } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !username ||
    !password ||
    !dateOfBirth
  )
    return res.sendStatus(400); // bad request

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.sendStatus(409); // conflict

  const passwordHash = await bcrypt.hash(password, 10);
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
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(400); // Bad Request

  const user = await User.findOne({ username });
  if (!user) return res.sendStatus(404);

  const validatePassword = await bcrypt.compare(password, user.password);
  if (!validatePassword) return res.sendStatus(404);

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
};

const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401); // Not Authorized

  const token = cookies.refreshToken;

  const retrieveToken = await User.findOne({ token });
  if (!retrieveToken) return res.sendStatus(404); // Forbidden

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
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(401); // Not Authorized

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
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
