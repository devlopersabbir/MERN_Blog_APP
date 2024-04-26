import express from "express";
import {
  createPost,
  uploadThumbnail,
  getAllPosts,
  getSinglePost,
  getCategoryPost,
  getAuthorPost,
  editPost,
  deletePost,
} from "../controllers/postController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../helper/multer.js";

const postRouter = express.Router();

postRouter.post(
  "/post/create",
  authMiddleware,
  upload.single("thumbnail"),
  createPost
);
postRouter.post("/post/thumbnail", authMiddleware, uploadThumbnail);
postRouter.get("/post/all", getAllPosts);
postRouter.get("/post/single/:id", getSinglePost);
postRouter.get("/post/author/:id", getAuthorPost);
postRouter.get("/post/category/:category", getCategoryPost);
postRouter.put("/post/edit/:id", authMiddleware, editPost);
postRouter.delete("/post/delete/:id", authMiddleware, deletePost);

export default postRouter;
