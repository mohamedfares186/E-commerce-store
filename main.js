require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const limitAccess = require("./middleware/rateLimit");
const logger = require("./middleware/logger");
const errorHandling = require("./middleware/errorHandling");

// Authentication routes
const auth = require("./auth/auth.route");

// MongoDB Connection
connectDB();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(logger);

// Routes
app.use("/auth", limitAccess, auth);

// Error Handling Middleware
app.use(errorHandling);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB successfully");
  app.listen(port, () => {
    console.log("Server is running");
  });
});
