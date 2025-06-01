import prisma from "../prisma/client.js";

// Add a product to favorites
export const addToFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if already in favorites
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json({
      message: "Added to favorites",
      favorite,
    });
  } catch (error) {
    next(error);
  }
};

// Get user's favorites
export const getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    res.status(200).json({
      favorites,
    });
  } catch (error) {
    next(error);
  }
};

// Remove from favorites
export const removeFromFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if favorite exists and belongs to the user
    const favorite = await prisma.favorite.findUnique({
      where: { id },
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    if (favorite.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Remove from favorites
    await prisma.favorite.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Removed from favorites",
    });
  } catch (error) {
    next(error);
  }
};

// Check if a product is in user's favorites
export const checkFavoriteStatus = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    res.status(200).json({
      isFavorite: !!favorite,
      favoriteId: favorite ? favorite.id : null,
    });
  } catch (error) {
    next(error);
  }
};