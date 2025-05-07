
const errorMiddleware = (err, req, res, next) => {

  
  const statusCode = err.statusCode || 500; // Default to 500 if no status code is provided
  const errorMessage = err.message || 'Internal Server Error'; // Default error message

  // Send a structured response to the client
  res.status(statusCode).json({
    message: errorMessage,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Show stack trace only in development
  });
};

export default errorMiddleware;
