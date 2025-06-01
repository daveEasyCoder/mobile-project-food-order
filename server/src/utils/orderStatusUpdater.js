import prisma from "../prisma/client.js";
import { createNotification } from "../controllers/notifications.controller.js";

/**
 * Time intervals (in minutes) for automatic status transitions
 * Temporarily reduced for testing purposes
 */
const STATUS_TRANSITION_TIMES = {
  PENDING_TO_PROCESSING: 0.1,  // 6 seconds after order creation
  PROCESSING_TO_SHIPPED: 0.1,  // 6 seconds after processing
  SHIPPED_TO_DELIVERED: 0.1    // 6 seconds after shipping
};

/**
 * Update order status based on time elapsed
 */
export const updateOrderStatuses = async () => {
  try {
    console.log("Running automatic order status update...");
    const now = new Date();
    
    // 1. Find PENDING orders that should move to PROCESSING
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: "PENDING",
        createdAt: {
          lt: new Date(now.getTime() - STATUS_TRANSITION_TIMES.PENDING_TO_PROCESSING * 60 * 1000)
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true
          }
        }
      }
    });
    
    // 2. Find PROCESSING orders that should move to SHIPPED
    const processingOrders = await prisma.order.findMany({
      where: {
        status: "PROCESSING",
        updatedAt: {
          lt: new Date(now.getTime() - STATUS_TRANSITION_TIMES.PROCESSING_TO_SHIPPED * 60 * 1000)
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true
          }
        }
      }
    });
    
    // 3. Find SHIPPED orders that should move to DELIVERED
    const shippedOrders = await prisma.order.findMany({
      where: {
        status: "SHIPPED",
        updatedAt: {
          lt: new Date(now.getTime() - STATUS_TRANSITION_TIMES.SHIPPED_TO_DELIVERED * 60 * 1000)
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true
          }
        }
      }
    });
    
    // Update PENDING orders to PROCESSING
    for (const order of pendingOrders) {
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          status: "PROCESSING",
          updatedAt: now
        }
      });
      
      // Check for existing notification to prevent duplicates
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId: order.userId,
          type: "ORDER_STATUS",
          title: "Order Processing",
          relatedId: order.id
        }
      });
      
      // Only create notification if one doesn't already exist
      if (!existingNotification) {
        await createNotification({
          userId: order.userId,
          type: "ORDER_STATUS",
          title: "Order Processing",
          message: `Your order #${order.id.slice(-6)} is now being prepared.`,
          relatedId: order.id
        });
      }
      
      console.log(`Updated order ${order.id} from PENDING to PROCESSING`);
    }
    
    // Update PROCESSING orders to SHIPPED
    for (const order of processingOrders) {
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          status: "SHIPPED",
          updatedAt: now
        }
      });
      
      // Check for existing notification to prevent duplicates
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId: order.userId,
          type: "ORDER_STATUS",
          title: "Order Shipped",
          relatedId: order.id
        }
      });
      
      // Only create notification if one doesn't already exist
      if (!existingNotification) {
        await createNotification({
          userId: order.userId,
          type: "ORDER_STATUS",
          title: "Order Shipped",
          message: `Your order #${order.id.slice(-6)} has been shipped and is on its way!`,
          relatedId: order.id
        });
      }
      
      console.log(`Updated order ${order.id} from PROCESSING to SHIPPED`);
    }
    
    // Update SHIPPED orders to DELIVERED
    for (const order of shippedOrders) {
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          status: "DELIVERED",
          updatedAt: now
        }
      });
      
      // Check for existing notification to prevent duplicates
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId: order.userId,
          type: "ORDER_STATUS",
          title: "Order Delivered",
          relatedId: order.id
        }
      });
      
      // Only create notification if one doesn't already exist
      if (!existingNotification) {
        await createNotification({
          userId: order.userId,
          type: "ORDER_STATUS",
          title: "Order Delivered",
          message: `Your order #${order.id.slice(-6)} has been delivered. Enjoy your meal!`,
          relatedId: order.id
        });
      }
      
      console.log(`Updated order ${order.id} from SHIPPED to DELIVERED`);
    }
    
    const totalUpdated = pendingOrders.length + processingOrders.length + shippedOrders.length;
    console.log(`Auto-update complete. Updated ${totalUpdated} orders.`);
    
    return {
      pendingToProcessing: pendingOrders.length,
      processingToShipped: processingOrders.length,
      shippedToDelivered: shippedOrders.length,
      totalUpdated
    };
  } catch (error) {
    console.error("Error in automatic order status update:", error);
    throw error;
  }
};

/**
 * Schedule periodic order status updates
 * @param {number} intervalMinutes - Interval in minutes between updates
 */
export const scheduleOrderStatusUpdates = (intervalMinutes = 2) => {
  console.log(`Scheduling automatic order status updates every ${intervalMinutes} minutes`);
  
  // Run immediately on startup
  updateOrderStatuses().catch(error => {
    console.error("Error in initial order status update:", error);
  });
  
  // Schedule periodic updates
  const intervalMs = intervalMinutes * 60 * 1000;
  return setInterval(() => {
    updateOrderStatuses().catch(error => {
      console.error("Error in scheduled order status update:", error);
    });
  }, intervalMs);
};
