import express from "express";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import AppError from "../utils/appError.js";
import { notifyUsersAboutNewProduct } from "../utils/notificationUtils.js";

const app = express();
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAllProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    if (!products || products.length === 0)
      return res.status(404).json({ message: "No products found" });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "something error happend" });
  }
};

const createProduct = async (req, res, next) => {
  const ingredients = JSON.parse(req.body.ingredients);
  try {
    if (!req.file)
      return res.status(400).json({ message: "No logo image uploaded" });
    if (!req.file.mimetype.startsWith("image/"))
      return next(new AppError("Uploaded file is not an image",400));

    const resizedBuffer = await sharp(req.file.buffer).toBuffer();

    // // // Define file path'
    const cleanFileName = req.file.originalname.replace(/\s+/g, "-");
    let filename = cleanFileName.split(".")[0];
    filename = `${filename}-${Date.now()}.jpeg`;
    const uploadDir = path.join(__dirname, "../uploads/product");
    const filePath = path.join(uploadDir, filename);


    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    await fs.promises.writeFile(filePath, resizedBuffer);

    // Create product entry in database
    const product = await prisma.product.create({
      data: {
        ...req.body,
        ingredients: ingredients,
        price: parseFloat(req.body.price),
        img: `/uploads/product/${filename}`,
      },
    });
    
    // Send notification to all users about the new product
    try {
      const notificationCount = await notifyUsersAboutNewProduct(product);
      console.log(`Sent notifications to ${notificationCount} users about new product: ${product.name}`);
    } catch (notificationError) {
      console.error("Error sending new product notifications:", notificationError);
      // Continue with response even if notifications fail
    }
    
    res.status(200).json({message:"Product created successfully" , product})

  } catch (error) {
    return next(new AppError("Failed to create job",500));
  }
};


const deleteAllProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.deleteMany();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error :", error);
    return next(new AppError("something error happend", 500));
  }
};

const deleteProduct = async (req, res, next) => {
  
  const {id}= req.params;
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!existingProduct) {
      return next(new AppError("Product not found", 404));
    }
    const deletedProduct = await prisma.product.delete({
      where: { id: id },
    });

    res.status(200).json({
      message: 'Product deleted successfully',
      product: deletedProduct,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("Product not found or already deleted", 404));
  }
};

// const deletProduct = async () => {
//   const product = req.body;

//   const deletedProduct = await prisma.product.findUnique({
//     id : product;
//   })
// };


const productcontroller = {
  createProduct,
  getAllProducts,
  deleteAllProducts,
  deleteProduct
};
export default productcontroller;
