import "dotenv/config";
import env from "./src/config/env.mjs";
import mongoose from "mongoose";
import app from "./app.mjs";
import { logger } from "./src/middleware/logger.mjs";

mongoose
  .connect(env.databaseUrl)
  .then(() => {
    logger.info("Connected to MongoDB successfully");
    app.listen(env.port, () => {
      logger.info("Server is running");
    });
  })
  .catch((error) => logger.error("MongoDB connection is interrupted: ", error));
