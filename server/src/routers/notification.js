import express from "express";
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications
} from "../controllers/notifications.controller.js";
import authMiddleHandler from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleHandler);

// Get user's notifications
router.get("/notifications", getUserNotifications);

// Mark a notification as read
router.patch("/notifications/:id/read", markNotificationAsRead);

// Mark all notifications as read
router.patch("/notifications/read-all", markAllNotificationsAsRead);

// Delete a notification
router.delete("/notifications/:id", deleteNotification);

// Clear all notifications
router.delete("/notifications/clear-all", clearAllNotifications);

export default router;
