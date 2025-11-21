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
    return decoded.id;
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

/* ========================================================================
    USER → ADMIN : Order Placed
======================================================================== */
export const notifyAdminOrder = async (order, items, user) => {
  try {
    const admin = await getAdminUser();
    if (!admin) return;

    const itemList = items.map((i) => `${i.name} x ${i.quantity}`).join(", ");

    await Notification.create({
      receiver: admin._id,
      sender: user._id,
      orderId: order._id,
      type: "order_created",
      title: "New Order Received",
      message: `Order Total ₹${order.summary.total} | Items: ${itemList}`,
    });
  } catch (err) {
    console.error("❌ notifyAdminOrder Error:", err);
  }
};

/* ========================================================================
    LOW STOCK ALERT
======================================================================== */
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
    console.error("❌ notifyLowStock Error:", err);
  }
};

/* ========================================================================
    OUT OF STOCK ALERT
======================================================================== */
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
    console.error("❌ notifyOutOfStock Error:", err);
  }
};

/* ========================================================================
    ADMIN → USER : Order Status Updated
======================================================================== */
export const notifyUserStatus = async (userId, orderId, status) => {
  try {
    await Notification.create({
      receiver: userId,
      orderId,
      type: status.toLowerCase(), // processing, shipped, delivered, cancelled
      title: "Order Status Updated",
      message: `Your order status changed to: ${status}`,
    });
  } catch (err) {
    console.error("❌ notifyUserStatus Error:", err);
  }
};

/* ========================================================================
    USER: GET OWN NOTIFICATIONS
======================================================================== */
export const getNotifications = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const notifications = await Notification.find({ receiver: userId })
      .populate("orderId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  } catch (err) {
    console.error("❌ getNotifications Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ========================================================================
    ADMIN: GET ALL NOTIFICATIONS
======================================================================== */
export const getAdminNotifications = async (req, res) => {
  try {
    const admin = await getAdminUser();
    if (!admin)
      return res.status(403).json({ success: false, message: "No Admin Found" });

    const notifications = await Notification.find({
      receiver: admin._id,
    })
      .populate("sender", "name email")
      .populate("orderId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  } catch (err) {
    console.error("❌ getAdminNotifications Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ========================================================================
    MARK AS READ
======================================================================== */
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.notificationId, {
      read: true,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ========================================================================
    MARK ALL AS READ
======================================================================== */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = getUserFromToken(req);

    await Notification.updateMany({ receiver: userId }, { read: true });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ========================================================================
    DELETE NOTIFICATION
======================================================================== */
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.notificationId);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
