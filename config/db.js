import "dotenv/config";
import mongoose from "mongoose";

// Connect to MongoDB
const mongoDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default mongoDB;
