import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unqiue: true,
    index: true,
  },
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
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerifiedToken: {
    type: String,
  },
  emailVerifyExpires: {
    type: Date,
  },
  token: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "moderator", "user"],
    default: "user",
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

export default mongoose.model("User", usersSchema);
