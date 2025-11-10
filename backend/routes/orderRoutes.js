import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// Create order
router.post("/create", createOrder);

// Get all orders
router.get("/", getAllOrders);

// Update order status (Seen / Cancelled / Completed)
router.patch("/status/:id", updateOrderStatus);

// User orders
router.get("/user/:id", getUserOrders);

export default router;
