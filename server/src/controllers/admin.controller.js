import prisma from "../prisma/client.js";
import { 
  sendPromotionToAllUsers, 
  sendSystemNotificationToAllUsers 
} from "../utils/notificationUtils.js";
import { updateOrderStatuses } from "../utils/orderStatusUpdater.js";

/**
 * Send a promotional notification to all users
 * @route POST /api/admin/notifications/promotion
 * @access Admin
 */
export const sendPromotion = async (req, res, next) => {
  try {
    // Verify admin role
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized - Admin access required" });
    }

    const { title, message, relatedId } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const count = await sendPromotionToAllUsers({
      title,
      message,
      relatedId
    });

    res.status(200).json({
      message: `Promotion sent to ${count} users`,
    });
  } catch (error) {
    console.error("Error sending promotion:", error);
    next(error);
  }
};

/**
 * Send a system notification to all users
 * @route POST /api/admin/notifications/system
 * @access Admin
 */
export const sendSystemNotification = async (req, res, next) => {
  try {
    // Verify admin role
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized - Admin access required" });
    }

    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const count = await sendSystemNotificationToAllUsers({
      title,
      message
    });

    res.status(200).json({
      message: `System notification sent to ${count} users`,
    });
  } catch (error) {
    console.error("Error sending system notification:", error);
    next(error);
  }
};

/**
 * Get notification statistics
 * @route GET /api/admin/notifications/stats
 * @access Admin
 */
export const getNotificationStats = async (req, res, next) => {
  try {
    // Verify admin role
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized - Admin access required" });
    }

    // Get total notifications count
    const totalNotifications = await prisma.notification.count();

    // Get unread notifications count
    const unreadNotifications = await prisma.notification.count({
      where: { isRead: false }
    });

    // Get notifications by type
    const orderStatusNotifications = await prisma.notification.count({
      where: { type: "ORDER_STATUS" }
    });

    const promotionNotifications = await prisma.notification.count({
      where: { type: "PROMOTION" }
    });

    const systemNotifications = await prisma.notification.count({
      where: { type: "SYSTEM" }
    });

    const paymentNotifications = await prisma.notification.count({
      where: { type: "PAYMENT" }
    });

    res.status(200).json({
      stats: {
        total: totalNotifications,
        unread: unreadNotifications,
        byType: {
          orderStatus: orderStatusNotifications,
          promotion: promotionNotifications,
          system: systemNotifications,
          payment: paymentNotifications
        }
      }
    });
  } catch (error) {
    console.error("Error getting notification stats:", error);
    next(error);
  }
};

/**
 * Trigger automatic order status updates
 * @route POST /api/admin/orders/auto-update
 * @access Admin
 */
export const triggerOrderStatusUpdate = async (req, res, next) => {
  try {
    // Verify admin role
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized - Admin access required" });
    }

    // Run the auto-update process
    const result = await updateOrderStatuses();

    res.status(200).json({
      message: "Order status auto-update completed successfully",
      result
    });
  } catch (error) {
    console.error("Error triggering order status update:", error);
    next(error);
  }
};
