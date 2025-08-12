import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import imageRoutes from "./routes/image.routes";
import commonRoutes from "./routes/common.routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app: Application = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// ✅ Route mounting
app.use("/api", authRoutes);
app.use("/api", imageRoutes);
app.use("/api", commonRoutes);
export default app;
