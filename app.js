import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { departmentRouter } from "./routes/departmentRoutes.js";
dotenv.config();

const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/department", departmentRouter);

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
