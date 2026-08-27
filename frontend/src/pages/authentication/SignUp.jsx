import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { FiEye, FiEyeOff, FiCamera } from "react-icons/fi";
import AuthLayout from "../../layouts/AuthLayout";
import FieldError from "../../utils/FieldError";
import { signUpSchema } from "../../utils/Validator/authValidator";
import { useRegisterMutation } from "../../store/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import { toast } from "sonner";
import { CgSpinnerTwoAlt } from "react-icons/cg";

const inputClass = (error) =>
  `w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${error
    ? "border-red-400 focus:ring-red-200"
    : "border-slate-300 focus:ring-blue-200 focus:border-blue-400"
  }`;

const roles = [
  { value: "team_member", label: "Team Member" },
  { value: "team_lead", label: "Team Lead" },
  { value: "project_manager", label: "Project Manager" },
  { value: "department_head", label: "Department Head" },
];

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit,reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: "",
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be less than 5MB");
      return;
    }

    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
    setImageError("");
  };

  const onSubmit = async (data) => {
    if (!profileFile) {
      setImageError("Profile image is required");
      return;
    }

    const { confirmPassword, ...fields } = data;

    const formData = new FormData();
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== undefined) formData.append(key, fields[key]);
    });
    if (profileFile) formData.append("profileImage", profileFile);

    try {
      const result = await registerUser(formData).unwrap();
      dispatch(setCredentials({
        user: result.data.user,
        token: result.data.token,
      }));
      toast.success(result.message || "Account created! Check your email for OTP.");
      reset();
      setProfileFile(null);
      setProfilePreview(null);
      setImageError("");
      navigate("/verify-otp");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout
      heading="Manage Projects Together"
      description="Collaborate with your team, track progress, and deliver projects on time."
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Fill in the details below to get started
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Profile Image */}
          <div className="flex justify-center">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-20 h-20 rounded-full border-2 border-dashed border-slate-300 cursor-pointer hover:border-blue-400 transition overflow-hidden flex items-center justify-center bg-slate-50"
            >
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiCamera className="text-slate-400" size={24} />
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                <FiCamera className="text-white" size={18} />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <p className="text-center text-xs text-slate-400 -mt-3">
            {profilePreview ? "Click to change" : "Upload profile photo"}
          </p>
          {imageError && (
            <p className="text-center text-xs text-red-500 -mt-2">{imageError}</p>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register("fullName")}
              placeholder="John Doe"
              className={inputClass(errors.fullName)}
            />
            <FieldError error={errors.fullName} />
          </div>

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
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Minimum 8 characters"
                className={`${inputClass(errors.password)} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            <FieldError error={errors.password} />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Re-enter your password"
                className={`${inputClass(errors.confirmPassword)} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
            <FieldError error={errors.confirmPassword} />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role
            </label>
            <select
              {...register("role")}
              className={`${inputClass(errors.role)} bg-white`}
            >
              <option value="" disabled>Select your role</option>
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <FieldError error={errors.role} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full   rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <CgSpinnerTwoAlt className="animate-spin text-white mx-auto" size={18} /> : "Sign Up"}
            
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-medium text-blue-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
