import prisma from "../prisma/client.js";
import { createNotification } from "./notifications.controller.js";

/**
 * Create a new order
 * @route POST /api/orders
 * @access Private
 */
export const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Order items are required" });
    }

    // Validate each item and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity) {
        return res.status(400).json({ 
          message: "Each order item must have productId and quantity" 
        });
      }

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(404).json({ 
          message: `Product with ID ${item.productId} not found` 
        });
      }

      // Calculate item total
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        name: product.name
      });
    }

    // Create the order with transaction to ensure all items are created
    const order = await prisma.$transaction(async (prisma) => {
      // Create main order
      const newOrder = await prisma.order.create({
        data: {
          userId,
          status: "PENDING",
          totalAmount,
          deliveryAddress: deliveryAddress || "",
          paymentMethod: paymentMethod || "CASH",
          orderItems: {
            create: orderItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              name: item.name
            }))
          }
        },
      });

      return newOrder;
    });

    // Fetch the complete order with items
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    // Check for existing notification to prevent duplicates
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        type: "ORDER_STATUS",
        title: "Order Placed Successfully",
        relatedId: order.id
      }
    });
    
    // Only create notification if one doesn't already exist
    if (!existingNotification) {
      await createNotification({
        userId,
        type: "ORDER_STATUS",
        title: "Order Placed Successfully",
        message: `Your order #${order.id.slice(-6)} has been received and is being processed.`,
        relatedId: order.id
      });
    }

    res.status(201).json({
      message: "Order created successfully",
      order: completeOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    next(error);
  }
};

/**
 * Get all orders for the current user
 * @route GET /api/orders/user
 * @access Private
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;
    const { skip, limit } = req.pagination || { skip: 0, limit: 10 };

    // Build the query
    const query = {
      userId,
      ...(status && { status })
    };

    // Get total count for pagination
    const totalOrders = await prisma.order.count({
      where: query
    });

    // Get paginated orders
    const orders = await prisma.order.findMany({
      where: query,
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    });

    // Send paginated response
    if (res.sendPaginated) {
      res.sendPaginated(orders, totalOrders);
    } else {
      res.status(200).json({
        data: orders,
        pagination: {
          total: totalOrders,
          page: Math.floor(skip / limit) + 1,
          limit
        }
      });
    }
  } catch (error) {
    console.error("Get user orders error:", error);
    next(error);
  }
};

/**
 * Get all orders (admin only)
 * @route GET /api/orders
 * @access Admin
 */
export const getAllOrders = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized - Admin access required" });
    }

    const { status } = req.query;
    const { skip, limit } = req.pagination || { skip: 0, limit: 10 };
    
    const whereClause = {};
    
    // Filter by status if provided
    if (status) {
      whereClause.status = status;
    }

    // Get total count for pagination
    const totalOrders = await prisma.order.count({
      where: whereClause
    });

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: parseInt(limit)
    });

    // Send paginated response
    if (res.sendPaginated) {
      res.sendPaginated(orders, totalOrders);
    } else {
      res.status(200).json({
        data: orders,
        pagination: {
          total: totalOrders,
          page: Math.floor(skip / limit) + 1,
          limit,
          pages: Math.ceil(totalOrders / limit)
        }
      });
    }
  } catch (error) {
    console.error("Get all orders error:", error);
    next(error);
  }
};

/**
 * Get order by ID
 * @route GET /api/orders/:id
 * @access Private (own orders) or Admin
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        orderItems: {
          include: {
            product: true
          }
        }
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow users to view their own orders or admins to view any order
    if (order.userId !== userId && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized - You can only view your own orders" });
    }

    res.status(200).json({
      order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    next(error);
  }
};

/**
 * Update order status
 * @route PATCH /api/orders/:id/status
 * @access Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Only admins can update order status
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized - Admin access required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Validate status
    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      },
      include: {
        orderItems: true,
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          }
        }
      }
    });

    // Create notification for the user based on the new status
    let notificationTitle, notificationMessage;
    
    switch (status) {
      case "PROCESSING":
        notificationTitle = "Order Processing";
        notificationMessage = `Your order #${id.slice(-6)} is now being prepared.`;
        break;
      case "SHIPPED":
        notificationTitle = "Order Shipped";
        notificationMessage = `Your order #${id.slice(-6)} has been shipped and is on its way!`;
        break;
      case "DELIVERED":
        notificationTitle = "Order Delivered";
        notificationMessage = `Your order #${id.slice(-6)} has been delivered. Enjoy your meal!`;
        break;
      case "CANCELLED":
        notificationTitle = "Order Cancelled";
        notificationMessage = `Your order #${id.slice(-6)} has been cancelled.`;
        break;
      default:
        notificationTitle = "Order Status Updated";
        notificationMessage = `Your order #${id.slice(-6)} status has been updated to ${status}.`;
    }

    // Check for existing notification to prevent duplicates
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId: updatedOrder.user.id,
        type: "ORDER_STATUS",
        title: notificationTitle,
        relatedId: id
      }
    });
    
    // Only create notification if one doesn't already exist
    if (!existingNotification) {
      await createNotification({
        userId: updatedOrder.user.id,
        type: "ORDER_STATUS",
        title: notificationTitle,
        message: notificationMessage,
        relatedId: id
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    next(error);
  }
};

/**
 * Delete an order
 * @route DELETE /api/orders/:id
 * @access Private (own orders) or Admin
 */
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow users to delete their own orders or admins to delete any order
    if (order.userId !== userId && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized - You can only delete your own orders" });
    }

    // For non-admins, only allow deletion of pending orders
    if (!isAdmin && order.status !== "PENDING") {
      return res.status(400).json({ 
        message: "Cannot delete orders that are already being processed. Please contact support." 
      });
    }

    // Delete the order and its items using a transaction
    await prisma.$transaction(async (prisma) => {
      // Delete order items first
      await prisma.orderItem.deleteMany({
        where: { orderId: id }
      });
      
      // Then delete the order
      await prisma.order.delete({
        where: { id }
      });
    });

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);
    next(error);
  }
};