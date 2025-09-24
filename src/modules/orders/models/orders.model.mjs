import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: String,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
        _id: false,
      },
    ],
    totalQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  address: {
    type: String,
    required: true,
  },
  orderVerified: {
    type: Boolean,
    default: false,
    required: true
  },
  orderVerifiedToken: {
    type: String,
  },
  orderVerifyExpires: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["cashOnDelivery", "creditCard"],
    default: "creditCard"
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["paid", "unpaid"],
    default: "unpaid"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
