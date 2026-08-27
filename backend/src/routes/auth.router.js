import { Router } from "express";
import {
  login,
  register,
  resendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateProfile,
} from "../controllers/auth.controller.js";
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
authRouter.route("/resend-otp").post(authMiddleware, resendOtp);
authRouter.route("/forgot-password").post(forgotPassword);
authRouter.route("/reset-password").post(authMiddleware, resetPassword);
authRouter.route("/get-user-profile").get(authMiddleware, getUserProfile);
authRouter.route("/update-profile").put(authMiddleware, uploadFiler.fields([
  {
    name: "profileImage",
    maxCount: 1,
  },
  {
    name: "coverImage",
    maxCount: 1,
  }
]), updateProfile);



export default authRouter;
