import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import imageRoutes from "./routes/image.routes";
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();

// ✅ CORS Options
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// ✅ Middleware
app.use(express.json()); // ✅ body parsing
app.use(express.urlencoded({ extended: true })); // ✅ for form data
app.use(cors(corsOptions)); // ✅ CORS setup

// ✅ Route mounting
app.use("/api", authRoutes);
app.use("/api", imageRoutes);
export default app;
