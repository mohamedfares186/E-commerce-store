import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  cartId: {
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
        min: 1,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
