import prisma from "../prisma/client.js";

/**
 * Create a new notification
 * @param {Object} data - Notification data
 * @returns {Promise<Object>} Created notification
 */
export const createNotification = async (data) => {
  try {
    const { userId, type, title, message, relatedId } = data;
    
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        relatedId,
        isRead: false,
      },
    });
    
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * Get all notifications for a user
 * @route GET /api/notifications
 * @access Private
 */
export const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, unreadOnly } = req.query;
    const skip = (page - 1) * limit;
    
    const whereClause = { userId };
    
    // Filter by read status if requested
    if (unreadOnly === 'true') {
      whereClause.isRead = false;
    }
    
    // Get total count for pagination
    const totalNotifications = await prisma.notification.count({
      where: whereClause
    });
    
    // Get notifications with pagination
    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: parseInt(limit),
    });
    
    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
    
    res.status(200).json({
      notifications,
      unreadCount,
      pagination: {
        total: totalNotifications,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalNotifications / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    next(error);
  }
};

/**
 * Mark a notification as read
 * @route PATCH /api/notifications/:id/read
 * @access Private
 */
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if notification exists and belongs to the user
    const notification = await prisma.notification.findUnique({
      where: { id },
    });
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    if (notification.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized - This notification doesn't belong to you" });
    }
    
    // Mark as read
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { 
        isRead: true,
        updatedAt: new Date()
      },
    });
    
    res.status(200).json({
      message: "Notification marked as read",
      notification: updatedNotification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    next(error);
  }
};

/**
 * Mark all notifications as read
 * @route PATCH /api/notifications/read-all
 * @access Private
 */
export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Update all unread notifications for the user
    const { count } = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        updatedAt: new Date()
      },
    });
    
    res.status(200).json({
      message: `${count} notifications marked as read`,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    next(error);
  }
};

/**
 * Delete a notification
 * @route DELETE /api/notifications/:id
 * @access Private
 */
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if notification exists and belongs to the user
    const notification = await prisma.notification.findUnique({
      where: { id },
    });
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    if (notification.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized - This notification doesn't belong to you" });
    }
    
    // Delete the notification
    await prisma.notification.delete({
      where: { id },
    });
    
    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    next(error);
  }
};

/**
 * Delete all notifications for a user
 * @route DELETE /api/notifications/clear-all
 * @access Private
 */
export const clearAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Delete all notifications for the user
    const { count } = await prisma.notification.deleteMany({
      where: { userId },
    });
    
    res.status(200).json({
      message: `${count} notifications cleared successfully`,
    });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    next(error);
  }
};
