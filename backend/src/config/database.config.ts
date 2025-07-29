import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

export const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("monogodb connection string is missing");
    }
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.dbName || "boarding-weekone",
    });
    console.log("monogdb connected succesffully");
  } catch (error) {
    console.log("failed ot connect mongodb");
    process.exit(1);
  }
};
