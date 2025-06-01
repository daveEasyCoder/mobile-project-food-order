/**
 * Global error handling middleware
 * Handles all errors thrown in the application and returns appropriate responses
 */
const errorMiddleware = (err, req, res, next) => {
  // Log error details for debugging
  console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.error(`Message: ${err.message}`);
  console.error(`Stack: ${err.stack}`);

  // Determine error type and appropriate status code
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errorType = "SERVER_ERROR";

  // Prisma specific errors
  if (err.name === 'PrismaClientKnownRequestError') {
    // Handle Prisma errors
    statusCode = 400;
    
    // P2002: Unique constraint violation
    if (err.code === 'P2002') {
      message = `Unique constraint violation on: ${err.meta?.target?.join(', ')}`;
      errorType = "UNIQUE_CONSTRAINT_ERROR";
    }
    // P2003: Foreign key constraint violation
    else if (err.code === 'P2003') {
      message = `Foreign key constraint violation`;
      errorType = "FOREIGN_KEY_ERROR";
    }
    // P2025: Record not found
    else if (err.code === 'P2025') {
      statusCode = 404;
      message = "Record not found";
      errorType = "NOT_FOUND_ERROR";
    }
  }
  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = "Invalid authentication token";
    errorType = "AUTH_ERROR";
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = "Authentication token expired";
    errorType = "AUTH_ERROR";
  }
  // Validation errors
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    errorType = "VALIDATION_ERROR";
  }

  // Send error response
  res.status(statusCode).json({
    message,
    errorType,
    // Only include stack trace in development environment
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;
