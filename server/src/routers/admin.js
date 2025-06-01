import express from "express";
import { 
  sendPromotion, 
  sendSystemNotification,
  getNotificationStats,
  triggerOrderStatusUpdate
} from "../controllers/admin.controller.js";
import authMiddleHandler from "../middlewares/authMiddleware.js";
import { validateRequest, validateNotificationCreation } from "../middlewares/validation.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleHandler);

// Send promotional notification to all users
router.post("/admin/notifications/promotion", validateRequest(validateNotificationCreation), sendPromotion);

// Send system notification to all users
router.post("/admin/notifications/system", validateRequest(validateNotificationCreation), sendSystemNotification);

// Get notification statistics
router.get("/admin/notifications/stats", getNotificationStats);

// Trigger automatic order status updates
router.post("/admin/orders/auto-update", triggerOrderStatusUpdate);

export default router;
