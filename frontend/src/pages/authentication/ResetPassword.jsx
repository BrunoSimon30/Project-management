import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AuthLayout from "../../layouts/AuthLayout";
import FieldError from "../../utils/FieldError";
import { resetPasswordSchema } from "../../utils/Validator/authValidator";
import { useResetPasswordMutation } from "../../store/api/authApi";
import { logout  } from "../../store/slices/authSlice";
import { toast } from "sonner";
import { CgSpinnerTwoAlt } from "react-icons/cg";

const inputClass = (error) =>
  `w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
    error
      ? "border-red-400 focus:ring-red-200"
      : "border-slate-300 focus:ring-blue-200 focus:border-blue-400"
  }`;

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetPasswordReq, { isLoading }] = useResetPasswordMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    localStorage.removeItem("forgotPasswordFlow");
  }, []);

 

  const onSubmit = async (data) => {
    try {
      await resetPasswordReq({
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();
      dispatch(logout());
      toast.success("Password reset successfully. You can now sign in.");
      navigate("/signin", { replace: true });
    } catch (err) {
      const msg = err?.data?.message || "Failed to reset password. Try again.";
      toast.error(msg);
    }
  };

   

  return (
    <AuthLayout
      heading="Set New Password"
      description="Choose a strong password for your account."
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Reset Password</h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("newPassword")}
                placeholder="At least 8 characters"
                className={`${inputClass(errors.newPassword)} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
            <FieldError error={errors.newPassword} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirm your password"
                className={`${inputClass(errors.confirmPassword)} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
            <FieldError error={errors.confirmPassword} />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <CgSpinnerTwoAlt
                className="animate-spin text-white mx-auto"
                size={18}
              />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Remember your password?{" "}
          <Link to="/signin" className="font-medium text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
