import { Router } from "express";
import { login, register, verifyOtp } from "../controllers/auth.controller.js";
import { uploadFiler } from "../utils/fileFilter.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.route("/login").post(login);
authRouter.route("/register").post(
  uploadFiler.fields([
    {
        name: "profileImage",
        maxCount: 1,
    },
    {
        name: "coverImage",
        maxCount: 1,
    }
  ]),
  register,
);

authRouter.route("/verify").post(authMiddleware, verifyOtp);


export default authRouter;
