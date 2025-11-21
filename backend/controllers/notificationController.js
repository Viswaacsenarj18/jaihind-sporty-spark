import Notification from "../models/Notification.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

/* -----------------------------------------
   Extract logged-in user from JWT token
----------------------------------------- */
const getUserFromToken = (req) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id; // userId
  } catch {
    return null;
  }
};

/* -----------------------------------------
   Helper: Get Admin User
----------------------------------------- */
const getAdminUser = async () => {
  return await User.findOne({ role: "admin" });
};

/* ============================================================================
   USER: GET OWN NOTIFICATIONS
============================================================================ */
export const getNotifications = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const notifications = await Notification.find({ receiver: userId })
      .populate("orderId")
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return res.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err) {
    console.error("❌ Error fetching user notifications:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================================
   ADMIN: GET ALL NOTIFICATIONS (order + stock alerts)
============================================================================ */
export const getAdminNotifications = async (req, res) => {
  try {
    const admin = await getAdminUser();
    if (!admin)
      return res.status(403).json({ success: false, message: "No admin found" });

    const notifications = await Notification.find({
      receiver: admin._id,
    })
      .populate("sender", "name email")
      .populate("orderId")
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return res.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err) {
    console.error("❌ Admin notifications error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================================
   MARK SINGLE NOTIFICATION AS READ
============================================================================ */
export const markAsRead = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, receiver: userId },
      { read: true },
      { new: true }
    );

    if (!notification)
      return res.status(404).json({ success: false, message: "Not found" });

    return res.json({ success: true, notification });
  } catch (err) {
    console.error("❌ markAsRead error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================================
   MARK ALL AS READ
============================================================================ */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    await Notification.updateMany({ receiver: userId }, { read: true });

    return res.json({ success: true, message: "All marked as read" });
  } catch (err) {
    console.error("❌ markAllAsRead error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================================
   DELETE NOTIFICATION
============================================================================ */
export const deleteNotification = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { notificationId } = req.params;

    await Notification.findOneAndDelete({
      _id: notificationId,
      receiver: userId,
    });

    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("❌ Delete notification error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================================
   TRIGGER 1: USER → ADMIN  (Order Placed)
============================================================================ */
export const notifyAdminOrder = async (order, items, user) => {
  try {
    const admin = await getAdminUser();
    if (!admin) return;

    const itemList = items
      .map((i) => `${i.name} x ${i.quantity}`)
      .join(", ");

    await Notification.create({
      receiver: admin._id,
      sender: user._id,
      orderId: order._id,
      type: "order_created",
      title: "New Order Received",
      message: `Amount ₹${order.summary.total} | Items: ${itemList}`,
    });
  } catch (err) {
    console.error("❌ notifyAdminOrder error:", err);
  }
};

/* ============================================================================
   TRIGGER 2: LOW STOCK ALERT
============================================================================ */
export const notifyLowStock = async (product) => {
  try {
    const admin = await getAdminUser();
    if (!admin) return;

    await Notification.create({
      receiver: admin._id,
      type: "low_stock",
      title: `Low Stock: ${product.name}`,
      message: `${product.name} has only ${product.stock} left!`,
    });
  } catch (err) {
    console.error("❌ notifyLowStock error:", err);
  }
};

/* ============================================================================
   TRIGGER 3: OUT OF STOCK ALERT
============================================================================ */
export const notifyOutOfStock = async (product) => {
  try {
    const admin = await getAdminUser();
    if (!admin) return;

    await Notification.create({
      receiver: admin._id,
      type: "out_of_stock",
      title: `OUT OF STOCK: ${product.name}`,
      message: `${product.name} is now OUT OF STOCK!`,
    });
  } catch (err) {
    console.error("❌ notifyOutOfStock error:", err);
  }
};

/* ============================================================================
   TRIGGER 4: ADMIN → USER (Order Status Update)
============================================================================ */
export const notifyUserStatus = async (userId, orderId, status) => {
  try {
    await Notification.create({
      receiver: userId,
      orderId,
      type: "status_updated",
      title: "Order Updated",
      message: `Your order status changed to: ${status}`,
    });
  } catch (err) {
    console.error("❌ notifyUserStatus error:", err);
  }
};
