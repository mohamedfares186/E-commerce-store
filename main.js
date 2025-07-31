import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import limiter from "./middleware/rateLimit.js";
import logger from "./middleware/logger.js";
import errorHandling from "./middleware/errorHandling.js";
import auth from "./auth/auth.route.js";
import users from "./users/users.route.js";
import categories from "./categories/categories.route.js";
import products from "./products/products.route.js";
import cart from "./cart/cart.route.js";
import orders from "./orders/orders.route.js";
import checkOut from "./checkout/checkout.route.js";

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
connectDB();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/auth", limiter, auth);
app.use("/api/users", limiter, users);
app.use("/api/categories", limiter, categories);
app.use("/api/products", limiter, products);
app.use("/api/cart", limiter, cart);
app.use("/api/orders", limiter, orders);
app.use("/api/checkout", limiter, checkOut);

// Error Handling Middleware
app.use(errorHandling);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB successfully");
  app.listen(port, () => {
    console.log("Server is running");
  });
});
