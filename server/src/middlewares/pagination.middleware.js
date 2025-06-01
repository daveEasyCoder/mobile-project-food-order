/**
 * Pagination middleware for API endpoints that return lists
 * Extracts page and limit parameters from the request query
 * and adds pagination metadata to the response
 */

/**
 * Default pagination middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const paginationMiddleware = (req, res, next) => {
  // Get page and limit from query params, with defaults
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // Validate page and limit
  if (page < 1) {
    return res.status(400).json({ message: "Page must be greater than 0" });
  }
  
  if (limit < 1 || limit > 100) {
    return res.status(400).json({ message: "Limit must be between 1 and 100" });
  }
  
  // Calculate skip for database query
  const skip = (page - 1) * limit;
  
  // Add pagination info to request object for controllers to use
  req.pagination = {
    page,
    limit,
    skip
  };
  
  // Create a custom method to send paginated responses
  res.sendPaginated = (data, total) => {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return res.status(200).json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrev,
        nextPage: hasNext ? page + 1 : null,
        prevPage: hasPrev ? page - 1 : null
      }
    });
  };
  
  next();
};
