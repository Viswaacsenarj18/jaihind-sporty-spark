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
   USER ROUTES
----------------------------------------- */

// Get user notifications
router.get("/", protectUser, getNotifications);

// Mark single notification as read
router.patch("/:notificationId/read", protectUser, markAsRead);

// Mark all as read
router.patch("/mark-all-as-read", protectUser, markAllAsRead);

// Delete notification
router.delete("/:notificationId", protectUser, deleteNotification);


/* -----------------------------------------
   ADMIN ROUTES
----------------------------------------- */

// Admin sees ALL notifications (order + stock)
router.get("/admin/all", protectAdmin, getAdminNotifications);


export default router;
