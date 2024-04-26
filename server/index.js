import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import { connectDB } from "./helper/database.js";
import postRouter from "./routes/postRoutes.js";
import path from "path";
// import { categoryRouter } from "./routes/categoryRoutes.js";
import { corsOptions } from "./helper/corsOption.js";

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
//Routes
app.use("/api", userRouter);
app.use("/api", postRouter);
// app.use("/api", categoryRouter);

// Serve static files from the 'server/uploads' folder
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // Connect db
  connectDB();
  console.log(`Server running on port ${port}`);
});
