import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import jwt from "jsonwebtoken";

/* ===================================================================
   CREATE ORDER (Now with protectUser middleware)
=================================================================== */
export const createOrder = async (req, res) => {
  try {
    // ✅ User is already authenticated via protectUser middleware
    const userId = req.user?._id || req.user?.id;
    
    console.log("📦 Creating order for user:", userId);
    console.log("🔍 req.user:", {
      id: req.user?._id,
      email: req.user?.email,
      role: req.user?.role,
    });

    if (!userId) {
      return res.status(401).json({ error: "User authentication failed" });
    }

    const { items, shippingInfo, summary } = req.body;

    console.log("📋 Order request:", {
      itemsCount: items?.length,
      total: summary?.total,
      shippingCity: shippingInfo?.city,
    });

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Validate shipping fields
    const requiredFields = [
      "firstName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    for (let field of requiredFields) {
      if (!shippingInfo[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // Validate stock
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ error: `Product not found: ${item.name}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }
    }

    // Create Order
    const order = await Order.create({
      user: userId,
      items,
      shippingInfo,
      summary,
      status: "Pending",
    });

    console.log("✅ Order created:", order._id);

    // Reduce stock
    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Add order to user's past orders
    await User.findByIdAndUpdate(userId, {
      $push: { pastOrders: order._id },
    });

    // Admin notification
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await Notification.create({
        user: admin._id,
        orderId: order._id,
        type: "new_order",
        title: "New Order Received",
        message: `A new order was placed. Total: ₹${summary.total}`,
      });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
      orderId: order._id,
    });
  } catch (err) {
    console.error("❌ Order Creation Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ===================================================================
   GET USER ORDERS (Protected by middleware)
=================================================================== */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    
    console.log("📋 Fetching orders for user:", userId);

    if (!userId) {
      return res.status(401).json({ error: "User authentication failed" });
    }

    const orders = await Order.find({ user: userId })
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    console.log("✅ Found orders:", orders.length);

    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Get User Orders Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ===================================================================
   GET ORDER DETAILS (Protected by middleware)
=================================================================== */
export const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { orderId } = req.params;

    console.log("🔍 Fetching order details:", { orderId, userId });

    if (!userId) {
      return res.status(401).json({ error: "User authentication failed" });
    }

    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("items.productId", "name price image");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Verify ownership
    if (order.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    console.log("✅ Order details retrieved");

    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Get Order Details Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ===================================================================
   CANCEL ORDER (Protected by middleware)
=================================================================== */
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { orderId } = req.params;

    console.log("❌ Cancelling order:", { orderId, userId });

    if (!userId) {
      return res.status(401).json({ error: "User authentication failed" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Verify ownership
    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (!["Pending", "Processing"].includes(order.status)) {
      return res.status(400).json({
        error:
          "Order cannot be cancelled. Only Pending or Processing orders can be cancelled.",
      });
    }

    // Restore stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "Cancelled";
    await order.save();

    console.log("✅ Order cancelled successfully");

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (err) {
    console.error("❌ Cancel Order Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ===================================================================
   ADMIN: GET ALL ORDERS (Protected by middleware)
=================================================================== */
export const getAllOrders = async (req, res) => {
  try {
    const adminId = req.admin?._id || req.user?._id;
    
    console.log("📊 Admin fetching all orders by:", adminId);

    if (!adminId) {
      return res.status(401).json({ error: "Admin authentication failed" });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    console.log("✅ Retrieved orders:", orders.length);

    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Get All Orders Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ===================================================================
   ADMIN: UPDATE ORDER STATUS (Protected by middleware)
=================================================================== */
export const updateOrderStatus = async (req, res) => {
  try {
    const adminId = req.admin?._id || req.user?._id;
    const { orderId } = req.params;
    const { status } = req.body;

    console.log("✏️ Updating order status:", { orderId, status, adminId });

    if (!adminId) {
      return res.status(401).json({ error: "Admin authentication failed" });
    }

    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    await order.save();

    console.log("✅ Order status updated to:", status);

    res.json({ success: true, message: "Order status updated", order });
  } catch (err) {
    console.error("❌ Update Status Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
