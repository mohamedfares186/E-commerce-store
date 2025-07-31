import crypto from "crypto";
import User from "../auth/auth.models.js";
import Cart from "../cart/cart.model.js";
import Order from "../orders/orders.model.js";
import Product from "../products/products.model.js";
import generateId from "../utils/generateId.js";
import { generateTokens } from "../utils/generateTokens.js";
import sendEmail from "../utils/sendEmails.js";


const checkOut = async (req, res) => {
	try {
    const { userId } = req.user;
    const { address } = req.body;

    if (!address) {
      return res
        .status(400)
        .json({ Error: "User Address is required to complete the order" });
    }

    const userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      return res
        .status(404)
        .json({ Error: "Cart Not Found, please add item to your cart" });
    }

    const cartItems = userCart.items;
    if (cartItems.length === 0) {
      return res.status(400).json({ Error: "Your cart is empty" });
    }

    const productIds = cartItems.map((item) => item.productId);
    const products = await Product.find({ productId: { $in: productIds } });

    // Check and reserve stock before creating order
    const stockCheck = await Promise.all(
      products.map(async (product) => {
        const cartItem = cartItems.find(item => item.productId === product.productId);
        if (cartItem.quantity > product.stock) {
          return { product, available: false };
        }
        return { product, available: true };
      })
    );

    const unavailableProducts = stockCheck.filter(item => !item.available);
    if (unavailableProducts.length > 0) {
      return res.status(400).json({ 
        Error: "Some products have insufficient stock",
        products: unavailableProducts.map(item => item.product.title)
      });
    }

    const { paymentMethod } = req.body;
    if (!paymentMethod) return res.status(400).json({ Error: "Please choose a valid payment method" });

    const paymentStatus = paymentMethod === "cashOnDelivery" ? "unpaid" : "paid";

    const orderVerified = false;

    const verify = orderVerified === true ? "confirmed" : "pending";

    const { token, hashedToken } = generateTokens();

    const orderId = generateId();

    const userOrder = new Order({
      orderId: orderId,
      user: userId,
      cart: {
        items: cartItems.map((item) => {
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          };
        }),
        totalQuantity: userCart.totalQuantity,
        totalAmount: userCart.totalAmount,
      },
      address: address,
      orderVerifiedToken: hashedToken,
      orderVerifyExpires: Date.now() + 60 * 60 * 1000,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      status: verify,
    });

    await userOrder.save();

    const user = await User.findOne({ userId: userId });

    const orderVerification = `http://localhost:3000/api/checkout/verify-order/${token}`;

    await sendEmail(
      user.email,
      "Verify your order",
      `Click this link to verify your order: ${orderVerification}`
    );

    // Update product stock
    for (const product of products) {
      const productInCart = cartItems.find(
        (item) => item.productId === product.productId
      );
      if (productInCart) {
        product.stock -= productInCart.quantity;
        await product.save();
      }
    }

    // Clear user's cart
    await Cart.findOneAndDelete({ user: userId });

    return res.status(201).json({
      success: true,
      message: "Order has been created successfully, please verify your order via email",
      data: userOrder
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const orderVerifying = async (req, res) => {
  try {
    const 
    { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const order = await Order.findOne({
      orderVerifiedToken: hashedToken,
      orderVerifyExpires: { $gt: Date.now() },
    });

    if (!order)
      return res.status(400).json({ Error: "Invalid or Expired token" });

    order.orderVerified = true;
    order.orderVerifiedToken = undefined;
    order.orderVerifyExpires = undefined;
    await order.save();

    return res.status(200).json({ Message: "Order has been verified successfully" });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export {
  checkOut,
  orderVerifying
};