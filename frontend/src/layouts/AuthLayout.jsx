import React from "react";
import teamworkSvg from "../assets/images/teamwork.svg";

export default function AuthLayout({
  children,
  heading = "Manage Projects Together",
  description = "Collaborate with your team, track progress, and deliver projects on time.",
}) {
  return (
    <section className="min-h-screen bg-slate-100 flex">
      {/* Left - Geometric Art */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-[#0F172A] p-10 relative overflow-hidden">
        <div className="max-w-md w-full relative z-10">
          <img
            src={teamworkSvg}
            alt="Geometric pattern"
            className="w-full h-auto rounded-2xl shadow-2xl"
          />
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {heading}
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              {description}
            </p>
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Real-time updates
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                Team collaboration
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                Task tracking
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-10">
        {children}
      </div>
    </section>
  );
}
