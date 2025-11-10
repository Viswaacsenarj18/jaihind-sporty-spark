import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  deleteOrder,
  updateOrderStatus
} from "../controllers/orderController.js";

const router = express.Router();

// ✅ Create order
router.post("/create", createOrder);

// ✅ Admin get all orders
router.get("/", getAllOrders);
router.get("/all", getAllOrders);

// ✅ User orders
router.get("/user/:id", getUserOrders);

// ✅ Admin delete order
router.delete("/:id", deleteOrder);

// ✅ Admin update order status
router.put("/:id/status", updateOrderStatus);

export default router;
