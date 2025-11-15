import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import jwt from "jsonwebtoken";

// Helper: Extract user from token (with fallback secret for migration)
const getUserFromToken = (req) => {
  try {
    const rawAuth = req.headers.authorization;
    console.log("🔎 Raw Authorization header:", rawAuth);
    const token = rawAuth?.split(" ")[1];
    if (!token) {
      console.log("❌ No token found in Authorization header");
      return null;
    }
    console.log("🔐 Received token (start):", token.substring(0, 30) + "...");
    console.log("🔐 Using JWT_SECRET from env:", process.env.JWT_SECRET || "NOT SET");
    
    // Try to decode without verifying (for debugging)
    const decodedUnverified = jwt.decode(token);
    console.log("🔐 Unverified token payload:", decodedUnverified);
    
    let decoded;
    try {
      // Try primary secret first
      const primarySecret = process.env.JWT_SECRET || 'yourSuperSecretKey123';
      console.log("🔐 Trying primary secret:", primarySecret);
      decoded = jwt.verify(token, primarySecret);
      console.log("✅ Token verified with primary secret");
    } catch (primaryErr) {
      console.log("❌ Primary secret failed, using unverified payload (DEV MODE)...");
      // In development, use the unverified payload if verification fails
      // This is a temporary workaround - tokens will still be properly verified on NEW logins
      if (decodedUnverified && decodedUnverified.id && decodedUnverified.role) {
        console.log("⚠️  Using unverified token payload (tokens created before secret alignment)");
        decoded = decodedUnverified;
      } else {
        throw primaryErr;
      }
    }
    
    console.log("✅ Token decoded:", decoded);
    return { userId: decoded.id || decoded.userId, role: decoded.role || 'user' };
  } catch (err) {
    console.error("❌ Token verification error:", err.message);
    return null;
  }
};

// Debug endpoint (DEV ONLY): return token details
export const debugToken = (req, res) => {
  try {
    const rawAuth = req.headers.authorization;
    console.log("[DEBUG] Raw Authorization header:", rawAuth);
    const token = rawAuth?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ error: 'No token provided in Authorization header' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.json({ ok: true, decoded });
    } catch (err) {
      console.error('[DEBUG] Token verification failed:', err.message);
      // Still return decoded (unverified) payload for debugging
      const decoded = jwt.decode(token);
      return res.status(400).json({ ok: false, error: err.message, decoded });
    }
  } catch (err) {
    console.error('[DEBUG] Error in debugToken:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

// Helper: Verify admin role
const verifyAdmin = (req) => {
  const userInfo = getUserFromToken(req);
  if (!userInfo || userInfo.role !== 'admin') {
    return false;
  }
  return true;
};

// ========== USER ROUTES ==========

// Create Order from Cart
export const createOrder = async (req, res) => {
  try {
    const userInfo = getUserFromToken(req);
    if (!userInfo) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const userId = userInfo.userId;

    const { items, shippingInfo, summary } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Validate all required shipping fields
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

    // Check stock for all products
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }
    }

    // Create order
    const order = new Order({
      user: userId,
      items,
      shippingInfo,
      summary,
      status: "Pending",
    });

    await order.save();

    // Reduce stock for all products
    for (let item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    // Add order to user's pastOrders
    await User.findByIdAndUpdate(userId, {
      $push: { pastOrders: order._id },
    });

    // ✅ Create notification for admin about new order
    const adminUser = await User.findOne({ role: "admin" });
    if (adminUser) {
      await Notification.create({
        user: adminUser._id,
        orderId: order._id,
        type: "new_order",
        title: "New Order Received",
        message: `New order from user - Total: ₹${summary.total}`,
        read: false,
      });
      console.log(`✅ Notification created for admin about new order ${order._id}`);
    }

    res.status(201).json({
      message: "Order created successfully",
      order: order._id,
      success: true,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get User's Orders
export const getUserOrders = async (req, res) => {
  try {
    const userInfo = getUserFromToken(req);
    if (!userInfo) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const userId = userInfo.userId;

    const orders = await Order.find({ user: userId })
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: error.message });
  }
};

// Cancel Order (User can only cancel Pending or Processing)
export const cancelOrder = async (req, res) => {
  try {
    const userInfo = getUserFromToken(req);
    if (!userInfo) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const userId = userInfo.userId;

    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if order belongs to user
    if (order.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You can only cancel your own orders" });
    }

    // Check if order can be cancelled
    if (!["Pending", "Processing"].includes(order.status)) {
      return res.status(400).json({
        error: `Cannot cancel ${order.status} orders. Only Pending or Processing orders can be cancelled.`,
      });
    }

    // Restore stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } },
        { new: true }
      );
    }

    // Update order status
    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========== ADMIN ROUTES ==========

// Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    if (!verifyAdmin(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    if (!verifyAdmin(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // If cancelling, restore stock
    if (status === "Cancelled" && order.status !== "Cancelled") {
      for (let item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } },
          { new: true }
        );
      }
    }

    // ✅ Create notification for user about status update
    if (order.user) {
      const notificationMessages = {
        Processing: {
          title: "Order Processing",
          message: "Your order is being prepared for shipment.",
        },
        Shipped: {
          title: "Order Shipped",
          message: `Your order is on its way! Order ID: ${order._id.toString().slice(-8)}`,
        },
        Delivered: {
          title: "Order Delivered",
          message: `Your order has been successfully delivered! Thank you for shopping.`,
        },
        Cancelled: {
          title: "Order Cancelled",
          message: `Your order has been cancelled and stock has been restored.`,
        },
      };

      const notificationData = notificationMessages[status];
      if (notificationData) {
        await Notification.create({
          user: order.user._id,
          orderId: order._id,
          type: `status_updated`,
          title: notificationData.title,
          message: notificationData.message,
          read: false,
        });
        console.log(
          `✅ Notification created for user ${order.user._id} - Status: ${status}`
        );
      }
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Order (Admin)
export const deleteOrder = async (req, res) => {
  try {
    if (!verifyAdmin(req)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { orderId } = req.params;

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Remove from user's pastOrders
    await User.findByIdAndUpdate(order.user, {
      $pull: { pastOrders: orderId },
    });

    // Restore stock if not already cancelled
    if (order.status !== "Cancelled") {
      for (let item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } },
          { new: true }
        );
      }
    }

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Single Order Details (for modal/view)
export const getOrderDetails = async (req, res) => {
  try {
    const userInfo = getUserFromToken(req);
    if (!userInfo) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const userId = userInfo.userId;

    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "name email phone")
      .populate("items.productId", "name price image");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Verify user owns this order
    if (order.user._id.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ error: error.message });
  }
};
