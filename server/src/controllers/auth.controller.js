import express from "express";
import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import AppError from "../utils/appError.js";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import { fileURLToPath } from "url";


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const registerController = async (req, res, next) => {
  const { username, email, password,usertype } = req.body;

  try {
    if (!req.file)
      return res.status(400).json({ message: "No logo image uploaded" });
    if (!req.file.mimetype.startsWith("image/"))
      return next(new AppError("Uploaded file is not an image", 400));

    const resizedBuffer = await sharp(req.file.buffer).toBuffer();

    const cleanFileName = req.file.originalname.replace(/\s+/g, "-");
    let filename = cleanFileName.split(".")[0];
    filename = `${filename}-${Date.now()}.jpeg`;
    const uploadDir = path.join(__dirname, "../uploads/profile");
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    await fs.promises.writeFile(filePath, resizedBuffer);

    const duplicateUser = await prisma.user.findUnique({ where: { email } });

    if (duplicateUser) {
      return next(new AppError("User already exists with this email", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        img: `/uploads/profile/${filename}`,
        role:usertype,
      },
    });

    const accessToken = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.ACCESS_TOKEN
    );
    return res
      .status(201)
      .json({newUser, accessToken, message: "User registered successfully" });
  } catch (error) {
    return next(error);
  }
};

const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return next(new AppError("User not registered", 400));
  }

  try {
    const check_password = await bcrypt.compare(password, user.password);
    if (!check_password) {
      return next(new AppError("Incorrect password", 400));
    }
    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN
    );

    return res.json({ token:accessToken, message: "Login successful" ,role:user.role});
  } catch (error) {
    return next(error);
  }
};

const logoutController = async (req, res, next) => {};

const authController = {
  registerController,
  loginController,
  logoutController,
};

export default authController;
