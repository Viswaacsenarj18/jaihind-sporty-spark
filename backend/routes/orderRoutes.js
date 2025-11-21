import express from "express";

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  cancelOrder,
  updateOrderStatus,
  getOrderDetails,
  deleteOrder,
} from "../controllers/orderController.js";

import { protectUser } from "../middleware/protectUser.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

/* =======================================================
   USER ROUTES
======================================================= */

// ➤ Create order
router.post("/create", protectUser, createOrder);

// ➤ Get logged-in user's orders
router.get("/user/my-orders", protectUser, getUserOrders);

// ➤ Get specific order details
router.get("/details/:orderId", protectUser, getOrderDetails);

// ➤ Cancel order
router.patch("/cancel/:orderId", protectUser, cancelOrder);


/* =======================================================
   ADMIN ROUTES
======================================================= */

// ➤ Get all orders (ADMIN)
router.get("/", protectAdmin, getAllOrders);
router.get("/admin/all", protectAdmin, getAdminNotifications);

// ➤ Update order status (ADMIN)
router.patch("/status/:orderId", protectAdmin, updateOrderStatus);

// ➤ Delete order (ADMIN)
router.delete("/:orderId", protectAdmin, deleteOrder);

export default router;
