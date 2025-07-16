const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unqiue: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "staff", "user"],
    default: "user",
  },
});

module.exports = mongoose.model("User", usersSchema);
