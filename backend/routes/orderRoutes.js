import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  cancelOrder,
  updateOrderStatus,
  getOrderDetails,
} from "../controllers/orderController.js";

const router = express.Router();

/* ----------------------- USER ROUTES ----------------------- */

// Create order
router.post("/create", createOrder);

// Get user's orders
router.get("/user/my-orders", getUserOrders);

// Get order details
router.get("/details/:orderId", getOrderDetails);

// Cancel order
router.patch("/cancel/:orderId", cancelOrder);


/* ----------------------- ADMIN ROUTES ----------------------- */

// Get all orders
router.get("/", getAllOrders);

// Update order status
router.patch("/status/:orderId", updateOrderStatus);

// ❌ deleteOrder removed (not exported anymore)


export default router;
