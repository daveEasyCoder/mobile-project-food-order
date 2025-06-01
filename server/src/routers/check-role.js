import express from "express";
import authMiddleHandler from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleHandler);

// Get current user role
router.get("/check-role", (req, res) => {
  res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      role: req.user.role
    }
  });
});

export default router;
