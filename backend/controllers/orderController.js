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
    if (!user) return res.status(401).json({ error: "Authentication required" });

    const { items, shippingInfo, summary } = req.body;

    // Validate items
    if (!items || items.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    // Validate shipping fields
    const required = [
      "firstName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    for (let field of required) {
      if (!shippingInfo[field])
        return res.status(400).json({ error: `${field} is required` });
    }

    // Validate stock
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ error: `Product not found: ${item.name}` });

      if (product.stock < item.quantity)
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
    }

    // Create Order
    const newOrder = await Order.create({
      user: user.userId,
      items,
      shippingInfo,
      summary,
      status: "Pending",
    });

    // Decrease stock
    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Attach order to user
    await User.findByIdAndUpdate(user.userId, {
      $push: { pastOrders: newOrder._id },
    });

    // Notification to admin
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await Notification.create({
        user: admin._id,
        orderId: newOrder._id,
        type: "new_order",
        title: "New Order Received",
        message: `New order placed. Total: ₹${summary.total}`,
      });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: newOrder._id,
    });
  } catch (err) {
    console.error("Order Creation Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ===================================================================
   GET USER ORDERS
=================================================================== */
export const getUserOrders = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Authentication required" });

    const orders = await Order.find({ user: user.userId })
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===================================================================
   CANCEL ORDER
=================================================================== */
export const cancelOrder = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Authentication required" });

    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.user.toString() !== user.userId)
      return res.status(403).json({ error: "Unauthorized" });

    if (!["Pending", "Processing"].includes(order.status))
      return res.status(400).json({ error: "Cannot cancel this order" });

    // Restore stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled" });
  } catch (err) {
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

    if (!["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Order updated", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===================================================================
   ORDER DETAILS
=================================================================== */
export const getOrderDetails = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Authentication required" });

    const order = await Order.findById(req.params.orderId)
      .populate("user", "name email")
      .populate("items.productId", "name price image");

    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.user._id.toString() !== user.userId)
      return res.status(403).json({ error: "Unauthorized" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
