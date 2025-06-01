import express from "express";
import { addToFavorites, getUserFavorites, removeFromFavorites, checkFavoriteStatus } from "../controllers/favorites.controller.js";
import authMiddleHandler from "../middlewares/authMiddleware.js";
import { favoritesCacheMiddleware, clearCacheMiddleware } from "../middlewares/cache.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleHandler);

// Add to favorites (clears cache)
router.post("/favorites", clearCacheMiddleware("/favorites"), addToFavorites);

// Get user's favorites (cached for 2 minutes)
router.get("/favorites", favoritesCacheMiddleware, getUserFavorites);

// Check if a product is in favorites
router.get("/favorites/check/:productId", checkFavoriteStatus);

// Remove from favorites (clears cache)
router.delete("/favorites/:id", clearCacheMiddleware("/favorites"), removeFromFavorites);

export default router;
