import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  cancelOrder,
  updateOrderStatus,
  getOrderDetails,
} from "../controllers/orderController.js";
import { protectUser } from "../middleware/protectUser.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

/* ----------------------- USER ROUTES ----------------------- */

// ✅ Create order (Protected - requires authentication)
router.post("/create", protectUser, createOrder);

// ✅ Get user's orders (Protected - requires authentication)
router.get("/user/my-orders", protectUser, getUserOrders);

// ✅ Get order details (Protected - requires authentication)
router.get("/details/:orderId", protectUser, getOrderDetails);

// ✅ Cancel order (Protected - requires authentication)
router.patch("/cancel/:orderId", protectUser, cancelOrder);


/* ----------------------- ADMIN ROUTES ----------------------- */

// ✅ Get all orders (Protected - admin only)
router.get("/", protectAdmin, getAllOrders);

// ✅ Update order status (Protected - admin only)
router.patch("/status/:orderId", protectAdmin, updateOrderStatus);

// ❌ deleteOrder removed (not exported anymore)


export default router;
