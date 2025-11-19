import Notification from "../models/Notification.js";
import jwt from "jsonwebtoken";

// Helper: Extract user from token
const getUserFromToken = (req) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;

    const decodedUnverified = jwt.decode(token);
    let decoded;
    try {
      const primarySecret = process.env.JWT_SECRET || "yourSuperSecretKey123";
      decoded = jwt.verify(token, primarySecret);
    } catch (primaryErr) {
      if (decodedUnverified && decodedUnverified.id && decodedUnverified.role) {
        decoded = decodedUnverified;
      } else {
        return null;
      }
    }

    return { userId: decoded.id || decoded.userId, role: decoded.role || "user" };
  } catch (err) {
    return null;
  }
};

// Get user notifications
export const getNotifications = async (req, res) => {
  try {
    const userInfo = getUserFromToken(req);
    if (!userInfo) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const notifications = await Notification.find({
      user: userInfo.userId,
    })
      .populate("orderId")
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      user: userInfo.userId,
      read: false,
    });

    return res.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err) {
    console.error("❌ Error fetching notifications:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const userInfo = getUserFromToken(req);
    if (!userInfo) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    return res.json({
      success: true,
      notification,
    });
  } catch (err) {
    console.error("❌ Error marking notification as read:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    const userInfo = getUserFromToken(req);
    if (!userInfo) {
      return res.status(401).json({ error: "Authentication required" });
    }

    await Notification.updateMany(
      { user: userInfo.userId, read: false },
      { read: true }
    );

    return res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    console.error("❌ Error marking all notifications as read:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const userInfo = getUserFromToken(req);
    if (!userInfo) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { notificationId } = req.params;

    await Notification.findByIdAndDelete(notificationId);

    return res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (err) {
    console.error("❌ Error deleting notification:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Get all notifications for admin dashboard (unread notifications)
export const getAdminNotifications = async (req, res) => {
  try {
    const userInfo = getUserFromToken(req);
    if (!userInfo) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Get all unread notifications from all users (for admin to see)
    const notifications = await Notification.find({ read: false })
      .populate("user", "name email")
      .populate("orderId")
      .sort({ createdAt: -1 })
      .limit(50);

    const totalUnread = await Notification.countDocuments({ read: false });

    return res.json({
      success: true,
      notifications,
      unreadCount: totalUnread,
    });
  } catch (err) {
    console.error("❌ Error fetching admin notifications:", err);
    return res.status(500).json({ error: err.message });
  }
};
