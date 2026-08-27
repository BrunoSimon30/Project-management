import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  updateProfileValidator,
  verifyOtpValidator,
} from "../utils/Validator/userValidator.js";
import constants from "../constants.js";
import { generateToken } from "../utils/generateToken.js";
import { User } from "../models/user.model.js";
import { FileUpload } from "../models/fileUpload.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto";
import { OTP } from "../models/otp.model.js";
import { sendEmail } from "../utils/SendEmail.js";
 

// Login Controller
const login = asyncHandler(async (req, res, next) => {
  const result = loginValidator.safeParse(req.body);
  if (!result.success) {
    return next(
      new ApiError(
        constants.UNPROCESSABLE_ENTITY_REQUEST,
        result.error.issues[0].message,
      ),
    );
  }

  const { email, password } = result.data;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(constants.NOT_FOUND, constants.USER_NOT_FOUND));
  }
  if (!user.isVerified) {
    const token = await generateToken({ userId: user._id });
    return res
      .status(constants.CONFLICT)
      .json(
        new ApiResponse(
          constants.CONFLICT,
          { token: token },
          constants.NOT_VERIFIED,
        ),
      );
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return next(
      new ApiError(constants.BAD_REQUEST, constants.INVALID_CREDENTIALS),
    );
  }
  const token = await generateToken({ userId: user._id });
  const userData = await User.findById(user._id);
  const profileImage = await FileUpload.findById(userData.profileImage);
  const coverImage = await FileUpload.findById(userData.coverImage);
  const data = await userData.transform();
  data.profileImage = profileImage?.file || null;
  data.coverImage = coverImage?.file || null;

  return res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        { user: data, token },
        constants.LOGIN_SUCCESSFULLY,
      ),
    );
});

// Register Controller
const register = asyncHandler(async (req, res, next) => {
  const result = registerValidator.safeParse(req.body);

  if (!result.success) {
    return next(
      new ApiError(
        constants.UNPROCESSABLE_ENTITY_REQUEST,
        result.error.issues[0].message,
      ),
    );
  }

  const { fullName, email, password, department, role } = result.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError(constants.CONFLICT, constants.EMAIL_EXIST));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    department,
    role,
  });

  const profileImage = req.files?.profileImage?.[0];
  const coverImage = req.files?.coverImage?.[0];

  if (profileImage) {
    const uploaded = await FileUpload.create({
      file: `/Uploads/${profileImage.filename}`,
      fileType: profileImage.mimetype,
      User: user._id,
    });
    user.profileImage = uploaded._id;
  }

  if (coverImage) {
    const uploaded = await FileUpload.create({
      file: `/Uploads/${coverImage.filename}`,
      fileType: coverImage.mimetype,
      User: user._id,
    });
    user.coverImage = uploaded._id;
  }
  await user.save();

  const otpcode = crypto.randomInt(1000, 10000);
  const otpExpire = Date.now() + 30 * 60 * 1000;

  const otp = await OTP.create({
    otpKey: String(otpcode),
    expireAt: otpExpire,
    user: user._id,
    reason: "register",
  });
  user.otp = otp._id;
  await user.save();

  try {
    await sendEmail(user.email, "OTP Verification", otpcode);
  } catch (err) {
    await FileUpload.deleteMany({ User: user._id });
    await OTP.findByIdAndDelete(otp._id);
    await User.findByIdAndDelete(user._id);
    return next(
      new ApiError(constants.BAD_REQUEST, constants.EMAIL_SEND_FAILED),
    );
  }

  const token = await generateToken({ userId: user._id });
  const userData = await User.findById(user._id);
  const profileImageData = await FileUpload.findById(userData.profileImage);
  const coverImageData = await FileUpload.findById(userData.coverImage);
  const data = await userData.transform();
  data.profileImage = profileImageData?.file || null;
  data.coverImage = coverImageData?.file || null;

  res
    .status(constants.CREATED)
    .json(
      new ApiResponse(
        constants.CREATED,
        { user: data, token },
        constants.USER_REGISTERED_SUCCESSFULLY,
      ),
    );
});

// Verify OTP Controller
const verifyOtp = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const result = verifyOtpValidator.safeParse(req.body);
  if (!result.success) {
    return next(
      new ApiError(
        constants.UNPROCESSABLE_ENTITY_REQUEST,
        result.error.issues[0].message,
      ),
    );
  }

  const { reason, otpcode } = result.data;
  if (!reason) {
    return next(new ApiError(constants.BAD_REQUEST, constants.REASON_REQUIRED));
  }
  if (!user) {
    return next(new ApiError(constants.NOT_FOUND, constants.USER_NOT_FOUND));
  }
  const otp = await OTP.findOne({ user: user._id, otpKey: otpcode });
  if (!otp) {
    return next(new ApiError(constants.NOT_FOUND, constants.OTP_NOT_FOUND));
  }
  if (otp.expireAt < Date.now()) {
    return next(new ApiError(constants.BAD_REQUEST, constants.OTP_EXPIRED));
  }
  if (otp.otpUsed) {
    return next(
      new ApiError(constants.BAD_REQUEST, constants.OTP_ALREADY_USED),
    );
  }
  otp.otpUsed = true;
  otp.reason = reason;
  await otp.save();
  user.isVerified = true;
  await user.save();
  const token = await generateToken({ userId: user._id });
  const userData = await User.findById(user._id);
  const profileImageData = await FileUpload.findById(userData.profileImage);
  const coverImageData = await FileUpload.findById(userData.coverImage);
  const data = await userData.transform();
  data.profileImage = profileImageData?.file || null;
  data.coverImage = coverImageData?.file || null;
  res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        { user: data, token },
        constants.OTP_VERIFIED_SUCCESSFULLY,
      ),
    );
});

// Resend OTP Controller
const resendOtp = asyncHandler(async (req, res, next) => {
  const user = req.user; // authMiddleware se aata hai
  if (!user) {
    return next(new ApiError(constants.NOT_FOUND, constants.USER_NOT_FOUND));
  }
  // if (user.isVerified) {
  //   return next(
  //     new ApiError(constants.BAD_REQUEST, "User is already verified."),
  //   );
  // }
  // Purane OTP ko invalidate (otpUsed = true)
  await OTP.deleteMany({ user: user._id, reason: "register" });
  const otpcode = crypto.randomInt(1000, 10000);
  const otpExpire = Date.now() + 30 * 60 * 1000;
  const otp = await OTP.create({
    otpKey: String(otpcode),
    expireAt: otpExpire,
    user: user._id,
    reason: "register",
  });
  user.otp = otp._id;
  await user.save();
  try {
    await sendEmail(user.email, "OTP Verification", otpcode);
  } catch (err) {
    await OTP.findByIdAndDelete(otp._id);
    return next(
      new ApiError(constants.BAD_REQUEST, constants.EMAIL_SEND_FAILED),
    );
  }
  return res
    .status(constants.OK)
    .json(new ApiResponse(constants.OK, {}, constants.OTP_RESENT_SUCCESSFULLY));
});

// Forgot Password Controller
const forgotPassword = asyncHandler(async (req, res, next) => {
  const result = forgotPasswordValidator.safeParse(req.body);
  console.log(req.body,'req.body');



  if (!result.success) {
    return next(
      new ApiError(
        constants.UNPROCESSABLE_ENTITY_REQUEST,
        result.error.issues[0].message,
      ),
    );
  }
  const { email } = result.data;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(constants.NOT_FOUND, constants.USER_NOT_FOUND));
  }
  // Purane forgetPassword OTP invalidate
  await OTP.deleteMany({ user: user._id, reason: "forgetPassword" });
  const otpcode = crypto.randomInt(1000, 10000);
  const otpExpire = Date.now() + 30 * 60 * 1000; // 30 min
  const otp = await OTP.create({
    otpKey: String(otpcode),
    expireAt: otpExpire,
    user: user._id,
    reason: "forgetPassword",
  });
  try {
    await sendEmail(user.email, "Reset Password OTP", otpcode);
  } catch (err) {
    await OTP.findByIdAndDelete(otp._id);
    return next(
      new ApiError(constants.BAD_REQUEST, constants.EMAIL_SEND_FAILED),
    );
  }
  const token = await generateToken({ userId: user._id });
  return res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        { token },
        "OTP sent to your email for password reset.",
      ),
    );
});

// Reset Password Controller (after OTP verified for forgetPassword)
const resetPassword = asyncHandler(async (req, res, next) => {
  const result = resetPasswordValidator.safeParse(req.body);
  if (!result.success) {
    return next(
      new ApiError(
        constants.UNPROCESSABLE_ENTITY_REQUEST,
        result.error.issues[0].message,
      ),
    );
  }
  const user = req.user;
  if (!user) {
    return next(new ApiError(constants.NOT_FOUND, constants.USER_NOT_FOUND));
  }
  const { newPassword } = result.data;
  user.password = newPassword;
  await user.save();
  return res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        {},
        "Password reset successfully. You can now sign in.",
      ),
    );
});

// get user profile Controller
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new ApiError(constants.NOT_FOUND, constants.USER_NOT_FOUND));
  }
  const userData = await User.findById(user._id);
  const token = await generateToken({ userId: user._id });
  const profileImage = await FileUpload.findById(userData.profileImage);
  const coverImage = await FileUpload.findById(userData.coverImage);
  const data = await userData.transform();
  data.profileImage = profileImage?.file || null;
  data.coverImage = coverImage?.file || null;
  return res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        { user: data, token },
        "User profile fetched successfully.",
      ),
    );
});

// Update Profile Controller
const updateProfile = asyncHandler(async (req, res, next) => {
  const result = updateProfileValidator.safeParse(req.body || {});
  if (!result.success) {
    return next(
      new ApiError(
        constants.UNPROCESSABLE_ENTITY_REQUEST,
        result.error.issues[0].message,
      ),
    );
  }
  const user = req.user;
  if (!user) {
    return next(new ApiError(constants.NOT_FOUND, constants.USER_NOT_FOUND));
  }

  const { fullName, role } = result.data || {};

  if (fullName !== undefined) user.fullName = fullName;
  if (role !== undefined) user.role = role;

  const profileImageFile = req.files?.profileImage?.[0];
  const coverImageFile = req.files?.coverImage?.[0];

  if (profileImageFile) {
    const uploaded = await FileUpload.create({
      file: `/Uploads/${profileImageFile.filename}`,
      fileType: profileImageFile.mimetype,
      User: user._id,
    });
    user.profileImage = uploaded._id;
  }

  if (coverImageFile) {
    const uploaded = await FileUpload.create({
      file: `/Uploads/${coverImageFile.filename}`,
      fileType: coverImageFile.mimetype,
      User: user._id,
    });
    user.coverImage = uploaded._id;
  }

  await user.save();

  const userData = await User.findById(user._id);
  const profileImage = await FileUpload.findById(userData.profileImage);
  const coverImage = await FileUpload.findById(userData.coverImage);
  const data = await userData.transform();
  data.profileImage = profileImage?.file || null;
  data.coverImage = coverImage?.file || null;

  return res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        { user: data },
        constants.PROFILE_UPDATED_SUCCESSFULLY,
      ),
    );
});

export {
  login,
  register,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateProfile,
};
