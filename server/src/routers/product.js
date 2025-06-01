import express from "express";
import upload from "../config/multer.js";
import productcontroller from "../controllers/products.controller.js";
import authorizeRoles from "../middlewares/rolebaseMiddleware.js";
import authMiddleHandler from "../middlewares/authMiddleware.js";
import { productCacheMiddleware, clearCacheMiddleware } from "../middlewares/cache.middleware.js";



const product = express.Router();

// Clear product cache when new product is created
product.post("/products", authorizeRoles("ADMIN"), upload.single('img'), clearCacheMiddleware("/products"), productcontroller.createProduct);
// Cache product listings for better performance
product.get("/products", productCacheMiddleware, productcontroller.getAllProducts);
// Clear product cache when products are deleted
product.delete("/products/del", authorizeRoles("ADMIN"), clearCacheMiddleware("/products"), productcontroller.deleteAllProducts);
product.delete("/products/:id", authorizeRoles("ADMIN"), clearCacheMiddleware("/products"), productcontroller.deleteProduct);



export default product;
