import express from "express";
import upload from "../config/multer.js";
import productHandler from "../controllers/products.controller.js";
import userController from "../controllers/users.controller.js";
import authMiddleHandler from "../middlewares/authMiddleware.js";



const user = express.Router();

user.get("/users/me",userController.getProfile);
user.put("/users/me",upload.single("img"),userController.updateProfile);


export default user;
