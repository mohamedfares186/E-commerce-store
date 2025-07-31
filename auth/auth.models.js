import mongoose from "mongoose";
import { U2000, U9550, U1234 } from "../config/roles.js";

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
    enum: [U2000, U9550, U1234],
    default: U1234,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

export default mongoose.model("User", usersSchema);
