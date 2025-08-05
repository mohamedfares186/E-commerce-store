import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import connectDB from "./config/db.js";
import limiter from "./middleware/rateLimit.js";
import logger from "./middleware/logger.js";
import errorHandling from "./middleware/errorHandling.js";
import mongoSanitize from "./middleware/mongoSanitize.js";
import auth from "./auth/auth.route.js";
import users from "./users/users.route.js";
import usersAdmin from "./users/users.adminRoute.js";
import categories from "./categories/categories.route.js";
import categoriesAdmin from "./categories/categories.adminRoute.js";
import products from "./products/products.route.js";
import productsAdmin from "./products/products.adminRoute.js";
import cart from "./cart/cart.route.js";
import cartAdmin from "./cart/cart.adminRoute.js";
import orders from "./orders/orders.route.js";
import ordersAdmin from "./orders/orders.adminRoute.js";
import checkOut from "./checkout/checkout.route.js";

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
connectDB();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  mongoSanitize({
    replaceWith: "_",
    sanitizeQuery: true,
    sanitizeBody: true,
    sanitizeParams: true,
    sanitizeHeaders: false,
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
    },
  })
);
app.use(logger);

// Routes
app.use("/api/auth", limiter, auth);
app.use("/api/users", limiter, users);
app.use("/api/categories", limiter, categories);
app.use("/api/products", limiter, products);
app.use("/api/carts", limiter, cart);
app.use("/api/orders", limiter, orders);
app.use("/api/checkout", limiter, checkOut);

// Admin Routes
app.use("/api/admin/users", limiter, usersAdmin);
app.use("/api/admin/categories", limiter, categoriesAdmin);
app.use("/api/admin/products", limiter, productsAdmin);
app.use("/api/admin/carts", limiter, cartAdmin);
app.use("/api/admin/orders", limiter, ordersAdmin);

// Error Handling Middleware
app.use(errorHandling);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB successfully");
  app.listen(port, () => {
    console.log("Server is running");
  });
});
