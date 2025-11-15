import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  cancelOrder,
  updateOrderStatus,
  deleteOrder,
  debugToken,
  getOrderDetails,
} from "../controllers/orderController.js";

const router = express.Router();

// ========== USER ROUTES ==========
router.post("/create", createOrder);
router.get("/debug/token", debugToken); // DEV: debug incoming Authorization header
router.get("/user/my-orders", getUserOrders);
router.patch("/cancel/:orderId", cancelOrder);
router.get("/details/:orderId", getOrderDetails);

// ========== ADMIN ROUTES ==========
router.get("/", getAllOrders); // Already requires admin check in controller
router.patch("/status/:orderId", updateOrderStatus); // Already requires admin check
router.delete("/:orderId", deleteOrder); // Already requires admin check

export default router;
