import express from "express";
import {
  userRegister,
  userLogin,
  getUser,
  uploadAvatar,
  updateUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/user/register", userRegister);
userRouter.post("/user/login", userLogin);
userRouter.post("/user/avatar", authMiddleware, uploadAvatar);
userRouter.put("/user/update/:id", authMiddleware, updateUser);
userRouter.get("/user/:id", getUser);

export default userRouter;
