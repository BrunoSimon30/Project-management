import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AuthLayout from "../../layouts/AuthLayout";
import FieldError from "../../utils/FieldError";
import { signInSchema } from "../../utils/Validator/authValidator";
import { useLoginMutation } from "../../store/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import { toast } from "sonner";
import { CgSpinnerTwoAlt } from "react-icons/cg";

const inputClass = (error) =>
  `w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
    error
      ? "border-red-400 focus:ring-red-200"
      : "border-slate-300 focus:ring-blue-200 focus:border-blue-400"
  }`;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await loginUser(data).unwrap();
      dispatch(setCredentials({
        user: result.data.user,
        token: result.data.token,
      }));
      toast.success(result.message || "Login successful!");
      navigate("/dashboard");
    } catch (err) {
      const errorData = err?.data;
      if (err?.status === 409 && errorData?.data?.token) {
        dispatch(setCredentials({ user: null, token: errorData.data.token }));
        toast.error(errorData.message || "Please verify your email first");
        navigate("/verify-otp", { state: { fromLogin: true } });
        return;
      }
      toast.error(errorData?.message || "Login failed");
    }
  };

  return (
    <AuthLayout
      heading="Welcome Back"
      description="Sign in to continue managing your projects and collaborating with your team."
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Sign In</h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className={inputClass(errors.email)}
            />
            <FieldError error={errors.email} />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter your password"
                className={`${inputClass(errors.password)} pr-10`}
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
            <FieldError error={errors.password} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <CgSpinnerTwoAlt className="animate-spin text-white mx-auto" size={18} /> : "Sign In"}
            
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
