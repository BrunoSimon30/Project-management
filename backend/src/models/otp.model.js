import mongoose from "mongoose";
 

const otpSchema = new mongoose.Schema(
  {
    otpKey: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otpUsed: {
      type: Boolean,
      default: false,
    },
    expireAt: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: ["verification", "register", "forgetPassword", "login"],
      default: "verification",
    },
  },
  { timestamps: true }
);

 


 


export const OTP = mongoose.model("Otp", otpSchema);
 