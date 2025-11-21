import Notification from "../models/Notification.js";
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
   USER: Get own notifications
----------------------------------------- */
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

/* -----------------------------------------
   ADMIN: Get all order notifications
----------------------------------------- */
export const getAdminNotifications = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    // You may check here if userId is admin using your protectAdmin middleware

    const notifications = await Notification.find({
      type: "order_created",
    })
      .populate("receiver", "name email")
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

/* -----------------------------------------
   Mark single notification as read
----------------------------------------- */
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
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });

    return res.json({
      success: true,
      notification,
    });
  } catch (err) {
    console.error("❌ Error marking notification as read:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* -----------------------------------------
   Mark all notifications as read
----------------------------------------- */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    await Notification.updateMany({ receiver: userId }, { read: true });

    return res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    console.error("❌ Error marking all as read:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* -----------------------------------------
   Delete notification
----------------------------------------- */
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

    return res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (err) {
    console.error("❌ Error deleting notification:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* -----------------------------------------
   TRIGGER: USER → ADMIN (order placed)
----------------------------------------- */
export const notifyAdmin = async (userId, orderId) => {
  try {
    return await Notification.create({
      receiver: null,          // admin read by /admin panel, not tied to a user
      sender: userId,
      orderId,
      type: "order_created",
      title: "New Order Received",
      message: "A customer placed a new order!",
      read: false,
    });
  } catch (err) {
    console.error("❌ Error creating admin notification:", err);
  }
};

/* -----------------------------------------
   TRIGGER: ADMIN → USER (status change)
----------------------------------------- */
export const notifyUser = async (userId, orderId, status) => {
  try {
    return await Notification.create({
      receiver: userId,
      sender: null, // admin system
      orderId,
      type: "status_updated",
      title: `Order Status Updated`,
      message: `Your order status changed to: ${status}`,
      read: false,
    });
  } catch (err) {
    console.error("❌ Error creating user notification:", err);
  }
};
