import express from "express";
import authController from "../controllers/auth.controller.js";
import upload from "../config/multer.js";


const auth = express.Router();

auth.post("/auth/signup", upload.single("img"),authController.registerController);
auth.post("/auth/login", authController.loginController);





export default auth;
