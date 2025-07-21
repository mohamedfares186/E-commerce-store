const Order = require("./orders.model");
const Cart = require("../cart/cart.model");
const Product = require("../products/products.model");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders) return res.status(404).json({ Error: "Orders Not Found" });

    res.status(200).json(orders);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

const getOrderByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ Error: "User ID is required" });

    const order = await Order.findOne({ user: userId });
    if (!order) return res.status(404).json({ Error: "Order is not found" });

    res.status(200).json(order);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

const createOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { address } = req.body;

    if (req.user._id !== userId)
      return res.status(401).json({ Error: "Unauthorized" });
    if (!address)
      return res
        .status(400)
        .json({ Message: "User Address is required to complete the order" });

    const userCart = await Cart.findOne({ user: userId });
    if (!userCart)
      return res
        .status(400)
        .json({ Message: "You have no items in your cart" });

    const cartItems = userCart.items;
    if (cartItems.length === 0)
      return res.status(400).json({ Message: "Your cart is empty" });

    const productIds = cartItems.map((item) => item.productId);
    const products = await Product.find({ _id: productIds });

    if (products.length !== productIds.length)
      return res.status(400).json({ Message: "Some products are not found" });
    if (products.some((product) => product.stock <= 0))
      return res
        .status(400)
        .json({ Message: "Some products are out of stock" });

    const userOrder = new Order({
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
    });

    await userOrder.save();
    res.status(201).json(userOrder);

    await products.forEach(async (product) => {
      const productInCart = cartItems.find(
        (item) => item.productId.toString() === product._id.toString()
      );
      if (productInCart) {
        product.stock -= productInCart.quantity;
        await product.save();
      }
    });

    await Cart.findByIdAndDelete(userCart._id);
  } catch (error) {
    res.status(500);
    console.log(error);
  }
};

const updateOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ Error: "Status is required" });

    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status))
      return res.status(400).json({ Error: "Invalid status" });

    const order = await Order.findOneAndUpdate(
      { user: userId },
      { status: status },
      { new: true }
    );
    if (!order) return res.status(404).json({ Error: "Order Not Found" });

    res.status(200).json(order);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};
const deleteOrder = async (req, res) => {
  try {
    const { userId } = req.params;

    const findOrder = await Order.findOneAndDelete({ user: userId });
    if (!findOrder) return res.status(404).json({ Error: "Order Not Found" });

    console.log(findOrder);

    res.status(204).json({ Message: "Order has been deleted successfully" });
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderByUser,
  createOrder,
  deleteOrder,
  updateOrder,
};
