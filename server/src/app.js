import express from "express";
import path from "path";
import prisma from "./prisma/client.js";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import errorMiddleware from "./middlewares/errorHandler.middleware.js";
import cors from 'cors'
import auth from "./routes/auth.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// middlware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cors());



//routes
// example
app.use("/api", auth);





app.use(errorMiddleware);
export default app;
