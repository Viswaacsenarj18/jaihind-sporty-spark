import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders
} from "../controllers/orderController.js";

const router = express.Router();

/**
 * ===========================
 * ✅ PUBLIC: CREATE ORDER
 * ===========================
 * POST /api/orders/create
 */
router.post("/create", createOrder);


/**
 * ===========================
 * ✅ ADMIN: GET ALL ORDERS
 * ===========================
 * GET /api/orders/all
 */
router.get("/all", getAllOrders);


/**
 * ===========================
 * ✅ ADMIN & USER: LIST ORDERS
 * ===========================
 * GET /api/orders
 * (Used by AdminOrders.tsx)
 */
router.get("/", getAllOrders);


/**
 * ===========================
 * ✅ USER: GET USER'S ORDERS
 * ===========================
 * GET /api/orders/user/:id
 */
router.get("/user/:id", getUserOrders);


export default router;
