import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getAdminNotifications,
} from "../controllers/notificationController.js";
import { protectUser } from "../middleware/protectUser.js";

const router = express.Router();

// ✅ Get all notifications for user (Protected)
router.get("/", protectUser, getNotifications);

// ✅ Get admin notifications (unread from all users) (Protected)
router.get("/admin/all", protectUser, getAdminNotifications);

// ✅ Mark single notification as read (Protected)
router.patch("/:notificationId/read", protectUser, markAsRead);

// ✅ Mark all as read (Protected)
router.patch("/mark-all-as-read", protectUser, markAllAsRead);

// ✅ Delete notification (Protected)
router.delete("/:notificationId", protectUser, deleteNotification);

export default router;
