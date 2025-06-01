import express from "express";
import prisma from "../prisma/client.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import { fileURLToPath } from "url";


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getProfile = async (req, res, next) => {
  try {
    const myProfile = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!myProfile) next(new AppError("User already doesn't exist", 400));
    res.status(200).json({ message: "hear is your profile", myProfile });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const { username, email, password } = req.body;

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

    const oldUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!oldUser) {
      return next(new AppError("User not found", 404));
    }
    if (email) {
      const duplicatedUser = await prisma.user.findUnique({
        where: { email },
      });

      if (duplicatedUser && duplicatedUser.id !== req.user.id) {
        return next(
          new AppError("Email is already taken by another user", 400)
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          username: username,
          password: hashedPassword,
          email: email,
          img: `/uploads/profile/${filename}`,
        },
      });

      const accessToken = jwt.sign(
        {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
        },
        process.env.ACCESS_TOKEN
      );
      return res.status(200).json({
        message: "Profile updated successfully",
        accessToken,
        user: updatedUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

//   }

//   try {
//     const oldUser = await prisma.user.findUnique({
//       where: { id: req.user.id },
//     });

//     if (!oldUser) {
//       return next(new AppError("User not found", 404));
//     }
//     if (email) {
//       const duplicatedUser = await prisma.user.findUnique({
//         where: { email },
//       });

//       if (duplicatedUser && duplicatedUser.id !== req.user.id) {
//         return next(
//           new AppError("Email is already taken by another user", 400)
//         );
//       }
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const updatedUser = await prisma.user.update({
//       where: { id: req.user.id },
//       data: {
//         username: username,
//         password: hashedPassword,
//         email: email,
//       },
//     });

//     const accessToken = jwt.sign(
//       {
//         id: updatedUser.id,
//         username: updatedUser.username,
//         email: updatedUser.email,
//         role:updatedUser.role
//       },
//       process.env.ACCESS_TOKEN
//     );

//     return res.status(200).json({
//       message: "Profile updated successfully",
//       accessToken,
//       user: updatedUser,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const getProfileById = (req, res, next) => {};

const userController = {
  getProfile,
  updateProfile,
};

export default userController;
