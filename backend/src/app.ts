import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";

const app: Application = express();

// ✅ CORS Options
const corsOptions = {
  origin: process.env.FRONTEND_URL,
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

export default app;
