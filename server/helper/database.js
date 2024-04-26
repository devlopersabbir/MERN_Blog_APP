import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connection Established...!");
  } catch (err) {
    console.log("Error: Database connection can not be established...!");
  }
}
