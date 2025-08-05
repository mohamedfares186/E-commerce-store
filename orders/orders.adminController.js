import User from "../users/users.model.js";
import Order from "./orders.model.js";
import sanitize from "../utils/sanitize.js";

// Admin Access
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ Error: "No orders found" });
    }

    return res.status(200).json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const getOrderByUserIdAdmin = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username)
      return res.status(400).json({ Error: "User ID is required" });

    const user = await User.findOne({ username: username });
    if (!user) return res.status(404).json({ Error: "User Not Found" });

    const orders = await Order.find({ user: user.userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ Error: "No orders found for this user" });
    }

    return res.status(200).json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const updateOrder = async (req, res) => {
  try {
    const { username, status } = req.body;

    // Sanitize input fields
    const sanitizedUsername = sanitize(username);
    const sanitizedStatus = sanitize(status);

    if (!sanitizedUsername)
      return res.status(400).json({ Error: "Username is required" });
    if (!sanitizedStatus)
      return res.status(400).json({ Error: "Status is required" });

    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(sanitizedStatus)) {
      return res.status(400).json({ Error: "Invalid status" });
    }

    const user = await User.findOne({ username: sanitizedUsername });
    if (!user) return res.status(404).json({ Error: "User Not Found" });

    const order = await Order.findOneAndUpdate(
      { user: user.userId },
      { status: sanitizedStatus },
      { new: true }
    );

    if (!order) return res.status(404).json({ Error: "Order Not Found" });

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId)
      return res.status(400).json({ Error: "Order ID is required" });

    const deletedOrder = await Order.findOneAndDelete({ orderId: orderId });
    if (!deletedOrder)
      return res.status(404).json({ Error: "Order Not Found" });

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const confirmedOrders = await Order.countDocuments({ status: "confirmed" });
    const shippedOrders = await Order.countDocuments({ status: "shipped" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    // Calculate total revenue from delivered orders
    const deliveredOrdersData = await Order.find({ status: "delivered" });
    const totalRevenue = deliveredOrdersData.reduce(
      (sum, order) => sum + order.cart.totalAmount,
      0
    );

    // Get recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    return res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export {
  getAllOrders,
  getOrderByUserIdAdmin,
  updateOrder,
  deleteOrder,
  getOrderStats,
};
