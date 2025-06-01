import express from "express";
import order from "./routers/order.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import prisma from "./prisma/client.js";
import upload from "./config/multer.js"; // Assuming you're using it in routes
import errorMiddleware from "./middlewares/errorHandler.middleware.js";
import {
  standardLimiter,
  authLimiter,
  orderLimiter,
  adminLimiter,
} from "./middlewares/rateLimit.middleware.js";
import {
  requestLogger,
  errorLogger,
} from "./middlewares/logging.middleware.js";
import logger from "./utils/logger.js";
import user from "./routers/user.js";
import auth from "./routers/auth.js";
import product from "./routers/product.js";
import order from "./routers/order.js";
import favorite from "./routers/favorite.js";
import notification from "./routers/notification.js";
import admin from "./routers/admin.js";
import checkRole from "./routers/check-role.js";
import authMiddleHandler from "./middlewares/authMiddleware.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cors());

// Initialize logger with environment-based log level
logger.setLogLevel(process.env.LOG_LEVEL || "INFO");
const appLogger = logger.createLogger("App");
appLogger.info("Application starting up");

// Apply request logging middleware
app.use(requestLogger);

// Apply standard rate limiting to all routes
app.use(standardLimiter);

app.get("/signup", async (req, res) => {
  const userlist = await prisma.user.findMany();
  res.status(200).json({ userlist });
});

// Auth routes with auth rate limiter
app.use("/api", authLimiter, auth);

// Product routes with standard rate limiter (already applied globally)
app.use("/api", authMiddleHandler, product);

// User routes with standard rate limiter (already applied globally)
app.use("/api", authMiddleHandler, user);

// Order routes with order rate limiter
app.use("/api", authMiddleHandler, orderLimiter, order);

// Favorite routes with standard rate limiter (already applied globally)
app.use("/api", authMiddleHandler, favorite);

// Notification routes with standard rate limiter (already applied globally)
app.use("/api", authMiddleHandler, notification);

// Admin routes with admin rate limiter
app.use("/api", authMiddleHandler, adminLimiter, admin);

// Apply error logging middleware before error handler
app.use(errorLogger);

// Apply error handler middleware
app.use(errorMiddleware);

// Log application startup
appLogger.info(`Server environment: ${process.env.NODE_ENV || "development"}`);
appLogger.info(
  `Server ready to accept connections on port ${process.env.PORT || 5000}`
);
//Routes
app.use("/api", order);

export default app;
