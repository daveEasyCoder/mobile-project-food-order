import express from "express";
import upload from "../config/multer.js";
import productcontroller from "../controllers/products.controller.js";
import authorizeRoles from "../middlewares/rolebaseMiddleware.js";
import authMiddleHandler from "../middlewares/authMiddleware.js";



const product = express.Router();

product.post("/products",authorizeRoles("ADMIN"), upload.single('img'),productcontroller.createProduct);
product.get("/products",productcontroller.getAllProducts);
product.delete("/products/del",authorizeRoles("ADMIN"),productcontroller.deleteAllProducts);
product.delete("/products/:id",authorizeRoles("ADMIN"),productcontroller.deleteProduct);



export default product;
