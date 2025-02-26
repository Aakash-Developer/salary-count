import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();
