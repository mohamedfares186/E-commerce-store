require("dotenv").config();
const mongoose = require("mongoose");

// Connect to MongoDB
const mongoDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
  } catch (err) {
    console.error(err);
  }
};

module.exports = mongoDB;
