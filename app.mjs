import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.config.mjs";
import limiter from "./src/middleware/rateLimit.mjs";
import { requestLogger } from "./src/middleware/logger.mjs";
import errorHandling from "./src/middleware/errorHandling.mjs";
import mongoSanitize from "./src/middleware/mongoSanitize.mjs";
import auth from "./src/modules/auth/routes/auth.routes.mjs";
import users from "./src/modules/users/routes/users.route.mjs";
import usersAdmin from "./src/modules/users/routes/users.adminRoute.mjs";
import categories from "./src/modules/categories/routes/categories.route.mjs";
import categoriesAdmin from "./src/modules/categories/routes/categories.adminRoute.mjs";
import products from "./src/modules/products/routes/products.route.mjs";
import productsAdmin from "./src/modules/products/routes/products.adminRoute.mjs";
import cart from "./src/modules/cart/routes/cart.route.mjs";
import cartAdmin from "./src/modules/cart/routes/cart.adminRoute.mjs";
import orders from "./src/modules/orders/routes/orders.route.mjs";
import ordersAdmin from "./src/modules/orders/routes/orders.adminRoute.mjs";
import checkOut from "./src/modules/checkout/routes/checkout.route.mjs";

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
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
app.use(cors());
app.use(hpp());
app.use(compression());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
    },
  })
);
app.use(requestLogger);

// Swagger routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/categories", categories);
app.use("/api/products", products);
app.use("/api/carts", cart);
app.use("/api/orders", orders);
app.use("/api/checkout", checkOut);

// Admin Routes
app.use("/api/admin/users", usersAdmin);
app.use("/api/admin/categories", categoriesAdmin);
app.use("/api/admin/products", productsAdmin);
app.use("/api/admin/carts", cartAdmin);
app.use("/api/admin/orders", ordersAdmin);

// Error Handling Middleware
app.use(errorHandling);

export default app;
