import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getAdminNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

// Get all notifications for user
router.get("/", getNotifications);

// Get admin notifications (unread from all users)
router.get("/admin/all", getAdminNotifications);

// Mark single notification as read
router.patch("/:notificationId/read", markAsRead);

// Mark all as read
router.patch("/mark-all-as-read", markAllAsRead);

// Delete notification
router.delete("/:notificationId", deleteNotification);

export default router;
