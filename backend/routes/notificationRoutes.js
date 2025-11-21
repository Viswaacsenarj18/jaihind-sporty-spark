import express from "express";
import {
  getNotifications,
  getAdminNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import { protectUser } from "../middleware/protectUser.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

/* -----------------------------------------
   ADMIN ROUTES (Must be before user routes)
----------------------------------------- */

// ✅ Admin gets all notifications (order + stock alerts)
router.get("/admin/all", protectAdmin, getAdminNotifications);


/* -----------------------------------------
   USER ROUTES
----------------------------------------- */

// ✅ Get user's own notifications
router.get("/", protectUser, getNotifications);

// ✅ Mark single notification as read
router.patch("/:notificationId/read", protectUser, markAsRead);

// ✅ Mark all notifications as read
router.patch("/mark-all-as-read", protectUser, markAllAsRead);

// ✅ Delete single notification
router.delete("/:notificationId", protectUser, deleteNotification);


export default router;
