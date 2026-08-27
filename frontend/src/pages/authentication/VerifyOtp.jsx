import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import AuthLayout from "../../layouts/AuthLayout";
import { useVerifyOtpMutation, useResendOtpMutation } from "../../store/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import { toast } from "sonner";
import { CgSpinnerTwoAlt } from "react-icons/cg";

const OTP_LENGTH = 4;

export default function VerifyOtp() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputsRef = useRef([]);
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromLogin) {
      handleResend();
      window.history.replaceState({}, "");
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setError("");

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const next = [...otp];
    for (let i = 0; i < OTP_LENGTH; i++) {
      next[i] = pasted[i] || "";
    }
    setOtp(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length < OTP_LENGTH) {
      setError("Please enter the full OTP code.");
      return;
    }

    const isForgotPassword =

      localStorage.getItem("forgotPasswordFlow") === "true";
    const reason = isForgotPassword ? "forgetPassword" : "register";
    try {
      const result = await verifyOtp({ otpcode: code, reason }).unwrap();
      dispatch(setCredentials({
        user: result.data.user,
        token: result.data.token,
      }));
      toast.success(result.message || (isForgotPassword ? "OTP verified. Set your new password." : "Email verified successfully!"));
      navigate(isForgotPassword ? "/reset-password" : "/signin");
    } catch (err) {
      const msg = err?.data?.message || "OTP verification failed";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    try {
      const result = await resendOtp({ reason: "register" }).unwrap();
      toast.success(result.message || "OTP sent to your email");

      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to resend OTP");
    }
  };

  const otpFilled = otp.every((d) => d !== "");

  return (
    <AuthLayout
      heading={location.state?.fromForgotPassword ? "Reset Password" : "Almost There"}
      description={location.state?.fromForgotPassword ? "Enter the 4-digit code sent to your email to reset your password." : "We've sent a verification code to your email. Enter it below to verify your account."}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-slate-800">Verify OTP</h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter the 4-digit code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputsRef.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`h-14 w-14 rounded-xl border-2 text-center text-2xl font-bold outline-none transition focus:ring-2 ${error
                    ? "border-red-400 focus:ring-red-200"
                    : digit
                      ? "border-blue-400 bg-blue-50 focus:ring-blue-200"
                      : "border-slate-300 focus:ring-blue-200 focus:border-blue-400"
                  }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-xs text-red-500">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isVerifying || !otpFilled}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? <CgSpinnerTwoAlt className="animate-spin text-white mx-auto" size={18} /> : "Verify"}
          </button>
        </form>

        {/* Resend */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            {location.state?.fromForgotPassword ? (
              <>
                Didn't receive the code?{" "}
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Try again
                </Link>
              </>
            ) : (
              <>
                Didn't receive the code?{" "}
                {resendCooldown > 0 ? (
                  <span className="font-medium text-slate-400">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="font-medium text-blue-600 hover:underline disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend OTP"}
                  </button>
                )}
              </>
            )}
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
