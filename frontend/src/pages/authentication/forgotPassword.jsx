import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import AuthLayout from "../../layouts/AuthLayout";
import FieldError from "../../utils/FieldError";
import { forgotPasswordSchema } from "../../utils/Validator/authValidator";
import { useForgotPasswordMutation } from "../../store/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import { toast } from "sonner";
import { CgSpinnerTwoAlt } from "react-icons/cg";

const inputClass = (error) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${error
        ? "border-red-400 focus:ring-red-200"
        : "border-slate-300 focus:ring-blue-200 focus:border-blue-400"
    }`;

export default function ForgotPassword() {
    const [forgotPasswordReq, { isLoading }] = useForgotPasswordMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data) => {
        try {
            const result = await forgotPasswordReq({ email: data.email }).unwrap();
            dispatch(
                setCredentials({
                    user: null,
                    token: result.data?.token || result.token,
                })
            );
            toast.success(result.message || "OTP sent to your email.");
            localStorage.setItem("forgotPasswordFlow", "true");
            navigate("/verify-otp");
        } catch (err) {
            const msg = err?.data?.message || "Something went wrong. Try again.";
            toast.error(msg);
        }
    };

    return (
        <AuthLayout
            heading="Reset Password"
            description="Enter your email and we'll send you a code to reset your password."
        >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-800">Forgot Password</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Enter the email linked to your account to receive a reset code
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                            "Send reset code"
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Remember your password?{" "}
                    <Link
                        to="/signin"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
