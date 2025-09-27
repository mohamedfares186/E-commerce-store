import Order from "../models/orders.model.mjs";
import { logger } from "../../../middleware/logger.mjs";

// User Access
const getOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) return res.status(403).json({ Error: "Access Denied" });

    const order = await Order.findOne({ user: userId });
    if (!order) return res.status(404).json({ Error: "Order is not found" });

    return res.status(200).json(order);
  } catch (error) {
    logger.error("Error getting user order: ", error.message)
  }
};

export default getOrderByUserId;
