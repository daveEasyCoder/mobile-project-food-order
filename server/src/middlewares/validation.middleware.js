/**
 * Validation middleware for API requests
 * Validates request body against a schema
 */

/**
 * Create a validation middleware for a specific schema
 * @param {Function} schema - Validation schema function that returns an object with error and value properties
 * @returns {Function} Express middleware
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({ 
        message: "Validation error", 
        details: errorMessage 
      });
    }
    
    // Replace request body with validated and sanitized data
    req.body = value;
    next();
  };
};

/**
 * Order creation validation schema
 * @param {Object} data - Request body
 * @returns {Object} Validation result
 */
export const validateOrderCreation = (data) => {
  const errors = [];
  
  // Validate items array
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push("Order must contain at least one item");
  } else {
    // Validate each item
    data.items.forEach((item, index) => {
      if (!item.productId) {
        errors.push(`Item at index ${index} is missing productId`);
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1) {
        errors.push(`Item at index ${index} must have a valid quantity (minimum 1)`);
      }
    });
  }
  
  // Validate delivery address
  if (!data.deliveryAddress || typeof data.deliveryAddress !== 'string' || data.deliveryAddress.trim() === '') {
    errors.push("Delivery address is required");
  }
  
  // Validate payment method
  const validPaymentMethods = ["CASH", "CREDIT_CARD", "DEBIT_CARD", "PAYPAL"];
  if (!data.paymentMethod || !validPaymentMethods.includes(data.paymentMethod)) {
    errors.push(`Payment method must be one of: ${validPaymentMethods.join(', ')}`);
  }
  
  if (errors.length > 0) {
    return {
      error: {
        details: errors.map(message => ({ message }))
      }
    };
  }
  
  return { value: data };
};

/**
 * Notification creation validation schema
 * @param {Object} data - Request body
 * @returns {Object} Validation result
 */
export const validateNotificationCreation = (data) => {
  const errors = [];
  
  // Validate title
  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push("Title is required");
  }
  
  // Validate message
  if (!data.message || typeof data.message !== 'string' || data.message.trim() === '') {
    errors.push("Message is required");
  }
  
  if (errors.length > 0) {
    return {
      error: {
        details: errors.map(message => ({ message }))
      }
    };
  }
  
  return { value: data };
};

/**
 * Order status update validation schema
 * @param {Object} data - Request body
 * @returns {Object} Validation result
 */
export const validateOrderStatusUpdate = (data) => {
  const errors = [];
  
  // Validate status
  const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!data.status || !validStatuses.includes(data.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }
  
  if (errors.length > 0) {
    return {
      error: {
        details: errors.map(message => ({ message }))
      }
    };
  }
  
  return { value: data };
};
