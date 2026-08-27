import React from "react";
import { Link } from "react-router";
import { FiCheckCircle, FiExternalLink, FiUsers } from "react-icons/fi";
import AuthLayout from "../layouts/AuthLayout";

export default function Home() {
  return (
    <AuthLayout
      heading="Project Management, Simplified"
      description="Plan projects, track tasks, and collaborate with your team. Start in seconds."
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Welcome</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign up to create projects, or sign in to continue where you left off.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FiUsers size={16} />
            Sign Up
          </Link>
          <Link
            to="/signin"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">Why you’ll love it</p>
          <div className="mt-3 space-y-3">
            <div className="flex items-start gap-3">
              <FiCheckCircle className="mt-0.5 text-blue-600" size={18} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">Project & task tracking</p>
                <p className="text-xs text-slate-500">Keep progress visible and organized.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiCheckCircle className="mt-0.5 text-blue-600" size={18} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">Team collaboration</p>
                <p className="text-xs text-slate-500">Assign managers, define departments, share links.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiCheckCircle className="mt-0.5 text-blue-600" size={18} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">Live/Demo references</p>
                <p className="text-xs text-slate-500">Show GitHub and demo links inside project cards.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/verify-otp"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
          >
            <FiExternalLink size={16} />
            Verify OTP
          </Link>
          <span className="hidden sm:inline text-slate-300">|</span>
          <Link
            to="/forgot-password"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
