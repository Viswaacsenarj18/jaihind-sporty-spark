import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import jwt from "jsonwebtoken";

/* ----------------------- JWT USER EXTRACTION ----------------------- */
const getUserFromToken = (req) => {
  try {
    const header = req.headers.authorization;
    if (!header) return null;

    const token = header.split(" ")[1];
    if (!token) return null;

    const secret = process.env.JWT_SECRET || "yourSuperSecretKey123";

    const decoded = jwt.verify(token, secret);

    return { userId: decoded.id, role: decoded.role };
  } catch {
    return null;
  }
};

/* ----------------------- ADMIN CHECK ----------------------- */
const verifyAdmin = (req) => {
  const user = getUserFromToken(req);
  return user && user.role === "admin";
};

/* ===================================================================
   CREATE ORDER
=================================================================== */
export const createOrder = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user)
      return res.status(401).json({ error: "Authentication required" });

    const { items, shippingInfo, summary } = req.body;

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
      user: user.userId,
      items,
      shippingInfo,
      summary,
      status: "Pending",
    });

    // Reduce stock
    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Add order to user's past orders
    await User.findByIdAndUpdate(user.userId, {
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
      orderId: order._id,
    });
  } catch (err) {
    console.error("Order Creation Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ===================================================================
   GET USER ORDERS
=================================================================== */
export const getUserOrders = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user)
      return res.status(401).json({ error: "Authentication required" });

    const orders = await Order.find({ user: user.userId })
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Get User Orders Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ===================================================================
   CANCEL ORDER
=================================================================== */
export const cancelOrder = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user)
      return res.status(401).json({ error: "Authentication required" });

    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order)
      return res.status(404).json({ error: "Order not found" });

    if (order.user.toString() !== user.userId) {
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

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (err) {
    console.error("Cancel Order Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ===================================================================
   ADMIN: GET ALL ORDERS
=================================================================== */
export const getAllOrders = async (req, res) => {
  try {
    if (!verifyAdmin(req))
      return res.status(403).json({ error: "Admin access required" });

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Get All Orders Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ===================================================================
   ADMIN: UPDATE ORDER STATUS
=================================================================== */
export const updateOrderStatus = async (req, res) => {
  try {
    if (!verifyAdmin(req))
      return res.status(403).json({ error: "Admin access required" });

    const { orderId } = req.params;
    const { status } = req.body;

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
    if (!order)
      return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Order status updated", order });
  } catch (err) {
    console.error("Update Status Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ===================================================================
   ORDER DETAILS
=================================================================== */
export const getOrderDetails = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user)
      return res.status(401).json({ error: "Authentication required" });

    const order = await Order.findById(req.params.orderId)
      .populate("user", "name email phone")
      .populate("items.productId", "name price image");

    if (!order)
      return res.status(404).json({ error: "Order not found" });

    if (order.user._id.toString() !== user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get Order Details Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
