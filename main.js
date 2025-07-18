require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const rateControl = require("./middleware/rateLimit");
const logger = require("./middleware/logger");
const errorHandling = require("./middleware/errorHandling");

// Authentication routes
const auth = require("./auth/auth.route");

// users routes
const users = require("./users/users.route");

// categories routes
const categories = require("./categories/categories.route");

// MongoDB Connection
connectDB();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(logger);

// Routes
app.use("/auth", rateControl, auth);
app.use("/users", rateControl, users);
app.use("/categories", rateControl, categories);

// Error Handling Middleware
app.use(errorHandling);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB successfully");
  app.listen(port, () => {
    console.log("Server is running");
  });
});
