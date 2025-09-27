import Cart from "../models/cart.model.mjs";
import User from "../../users/models/users.model.mjs";
import { logger } from "../../../middleware/logger.mjs";

// Admin Access
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();

    return res.status(200).json({
      success: true,
      data: carts,
      count: carts.length,
    });
  } catch (error) {
    logger.error("Error getting all carts: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getCartByUserIdAdmin = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username)
      return res.status(400).json({ Error: "User ID is required" });

    console.log(username);

    const user = await User.findOne({ username: username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const findUserCart = await Cart.findOne({ user: user.userId });

    console.log(findUserCart);

    if (!findUserCart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    return res.status(200).json({
      success: true,
      data: findUserCart,
    });
  } catch (error) {
    logger.error("Error admin getting cart by user Id: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { getAllCarts, getCartByUserIdAdmin };
