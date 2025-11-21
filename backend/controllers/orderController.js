import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { notifyAdmin, notifyUser } from "./notificationController.js";

/* ============================================================
   CREATE ORDER  (USER → ADMIN Notification)
============================================================ */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId)
      return res.status(401).json({ error: "User authentication failed" });

    const { items, shippingInfo, summary } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    // Validate stock
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ error: `Product not found: ${item.name}` });

      if (product.stock < item.quantity)
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}`,
        });
    }

    // Create order
    const newOrder = await Order.create({
      user: userId,
      items,
      shippingInfo,
      summary,
      status: "Pending",
    });

    // Update stock
    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Add order to user history
    await User.findByIdAndUpdate(userId, {
      $push: { pastOrders: newOrder._id },
    });

    // 🔥 NOTIFY ADMIN
    await notifyAdmin(userId, newOrder._id);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
      orderId: newOrder._id,
    });

  } catch (err) {
    console.error("❌ Order Creation Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};


/* ============================================================
   GET USER ORDERS
============================================================ */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const orders = await Order.find({ user: userId })
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================================================
   GET ORDER DETAILS
============================================================ */
export const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("items.productId", "name price image");

    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.user._id.toString() !== userId.toString())
      return res.status(403).json({ error: "Unauthorized access" });

    res.json({ success: true, order });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================================================
   CANCEL ORDER
============================================================ */
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.user.toString() !== userId.toString())
      return res.status(403).json({ error: "Unauthorized" });

    if (!["Pending", "Processing"].includes(order.status))
      return res.status(400).json({
        error: "Only Pending/Processing orders can be cancelled",
      });

    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================================================
   ADMIN: GET ALL ORDERS
============================================================ */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================================================
   ADMIN: UPDATE ORDER STATUS (ADMIN → USER Notification)
============================================================ */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status))
      return res.status(400).json({ error: "Invalid order status" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    // 🔥 NOTIFY USER
    await notifyUser(order.user, order._id, status);

    res.json({ success: true, message: "Order status updated", order });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================================================
   ADMIN: DELETE ORDER
============================================================ */
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    await User.findByIdAndUpdate(order.user, {
      $pull: { pastOrders: orderId },
    });

    await Order.findByIdAndDelete(orderId);

    res.json({ success: true, message: "Order deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
