import prisma from "../prisma/client.js";
import { createNotification } from "../controllers/notifications.controller.js";

/**
 * Create a promotional notification for a specific user
 * @param {Object} data - Notification data
 * @returns {Promise<Object>} Created notification
 */
export const createPromotionalNotification = async (data) => {
  try {
    const { userId, title, message, relatedId } = data;
    
    return await createNotification({
      userId,
      type: "PROMOTION",
      title,
      message,
      relatedId
    });
  } catch (error) {
    console.error("Error creating promotional notification:", error);
    throw error;
  }
};

/**
 * Send a promotional notification to all users
 * @param {Object} data - Notification data
 * @returns {Promise<number>} Number of notifications created
 */
export const sendPromotionToAllUsers = async (data) => {
  try {
    const { title, message, relatedId } = data;
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true
      }
    });
    
    // Create a notification for each user
    let count = 0;
    for (const user of users) {
      await createNotification({
        userId: user.id,
        type: "PROMOTION",
        title,
        message,
        relatedId
      });
      count++;
    }
    
    return count;
  } catch (error) {
    console.error("Error sending promotion to all users:", error);
    throw error;
  }
};

/**
 * Send a system notification to all users
 * @param {Object} data - Notification data
 * @returns {Promise<number>} Number of notifications created
 */
export const sendSystemNotificationToAllUsers = async (data) => {
  try {
    const { title, message } = data;
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true
      }
    });
    
    // Create a notification for each user
    let count = 0;
    for (const user of users) {
      await createNotification({
        userId: user.id,
        type: "SYSTEM",
        title,
        message
      });
      count++;
    }
    
    return count;
  } catch (error) {
    console.error("Error sending system notification to all users:", error);
    throw error;
  }
};

/**
 * Send a notification about a new product to all users
 * @param {Object} product - The new product
 * @returns {Promise<number>} Number of notifications created
 */
export const notifyUsersAboutNewProduct = async (product) => {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true
      }
    });
    
    // Create a notification for each user
    let count = 0;
    for (const user of users) {
      await createNotification({
        userId: user.id,
        type: "PROMOTION",
        title: "New Item Available!",
        message: `Try our new ${product.name} for just $${product.price.toFixed(2)}!`,
        relatedId: product.id
      });
      count++;
    }
    
    return count;
  } catch (error) {
    console.error("Error notifying users about new product:", error);
    throw error;
  }
};
