import express from "express";
import { 
  createOrder, 
  getUserOrders, 
  getAllOrders, 
  getOrderById,
  updateOrderStatus,
  deleteOrder 
} from "../controllers/orders.controller.js";
import authMiddleHandler from "../middlewares/authMiddleware.js";
import { validateRequest, validateOrderCreation, validateOrderStatusUpdate } from "../middlewares/validation.middleware.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleHandler);

// Create a new order
router.post("/orders", validateRequest(validateOrderCreation), createOrder);

// Get user's orders
router.get("/orders/user", paginationMiddleware, getUserOrders);

// Get all orders (admin only)
router.get("/orders", paginationMiddleware, getAllOrders);

// Get specific order by ID
router.get("/orders/:id", getOrderById);

// Update order status (admin only)
router.patch("/orders/:id/status", validateRequest(validateOrderStatusUpdate), updateOrderStatus);

// Delete an order
router.delete("/orders/:id", deleteOrder);

export default router;
