import express from "express";
import {
  getNotifications,
  getAdminNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import { protectUser } from "../middleware/protectUser.js";
import { protectAdmin } from "../middleware/auth.js"; // ✅ added import

const router = express.Router();

/* -----------------------------------------
   USER ROUTES
----------------------------------------- */

// Get all notifications for the logged-in user
router.get("/", protectUser, getNotifications);

// Mark a single notification as read
router.patch("/:notificationId/read", protectUser, markAsRead);

// Mark all notifications as read
router.patch("/mark-all-as-read", protectUser, markAllAsRead);

// Delete a notification
router.delete("/:notificationId", protectUser, deleteNotification);


/* -----------------------------------------
   ADMIN ROUTES
----------------------------------------- */

// Admin can view ALL notifications
router.get("/admin/all", protectAdmin, getAdminNotifications); // ✅ added protectAdmin


export default router;
