import Order from "./orders.model.js";

// User Access
const getOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) return res.status(403).json({ Error: "Access Denied" });

    const order = await Order.findOne({ user: userId });
    if (!order) return res.status(404).json({ Error: "Order is not found" });

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default getOrderByUserId;
