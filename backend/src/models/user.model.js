import mongoose from "mongoose";
import { comparePassword, hashPassword } from "../utils/hashHandler.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profileImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FileUpload",
      required: false,
    },
    coverImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FileUpload",
      required: false,
    },
    isVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    otp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Otp",
      required: false,
      default: null,
    },
    role: {
      type: String,
      enum: [
        "superadmin",
        "admin",
        "department_head",
        "project_manager",
        "team_lead",
        "team_member",
      ],
      default: "team_member",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: false,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    notification_on: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  try {
    if (!this.isModified("password")) return;
    this.password = await hashPassword(this.password);
  } catch (error) {
    console.error("Error in pre-save hook:", error);
    throw error;
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await comparePassword(password, this.password);
};

userSchema.methods.transform = async function () {
  const obj = await this.toObject();
  const fields = [
    "_id",
    "fullName",
    "email",
    "profileImage",
    "coverImage",
    "isVerified",
    "role",
    "department",
    "is_active",
    "notification_on",
    "is_deleted",
    "createdAt",
    "updatedAt",
  ];
  const transformed = {};
  fields.forEach((field) => {
    if (obj[field] !== undefined) transformed[field] = obj[field];
  });
  return transformed;
};

export const User = mongoose.model("User", userSchema);
