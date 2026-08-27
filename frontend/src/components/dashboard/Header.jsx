import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
 
import {
  LuMenu,
  LuSearch,
  LuBell,
  LuLogOut,
  LuUser,
  LuChevronDown,
  LuSettings,
  LuMaximize,
} from "react-icons/lu";
 
import profileImage from "@/assets/images/profile.jpg";
import { logout } from "@/store/slices/authSlice";
import constants from "@/utils/constants";

export default function Header({ onMenuClick }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <header className="sticky top-0 z-50 flex   items-center justify-between bg-white py-5 px-5 md:px-[25px]   rounded-b-md">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="text-slate-600 hover:text-blue-600 transition lg:hidden"
        >
          <LuMenu size={22} />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search here....."
            className="h-[40px] w-[220px] lg:w-[260px] rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition"
          />
          <LuSearch size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="hidden md:flex rounded-lg p-2 text-slate-500 hover:text-blue-600 transition"
        >
          <LuMaximize size={20} />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative rounded-lg p-2 text-slate-500 hover:text-blue-600 transition"
          >
            <LuBell size={20} />
            <span className="absolute right-[7px] top-[7px] h-[7px] w-[7px] rounded-full bg-orange-500" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-[300px] md:w-[350px] rounded-lg bg-white shadow-xl border border-slate-100 z-50">
              <div className="flex items-center justify-between px-5 py-4">
                <span className="font-semibold text-slate-800">
                  Notifications <span className="text-slate-400 font-normal text-sm">(0)</span>
                </span>
                <button className="text-sm text-blue-600 hover:underline">Clear All</button>
              </div>
              <div className="border-t border-dashed border-slate-100 px-5 py-8 text-center">
                <p className="text-sm text-slate-400">No new notifications</p>
              </div>
              <div className="border-t border-slate-100 py-3 text-center">
                <button
                  onClick={() => { setNotifOpen(false); navigate("/notifications"); }}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  See All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 rounded-lg py-1 px-2 hover:bg-slate-50 transition"
          >
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold ring-2 ring-blue-200">
              <img src={`${constants.IMAGE_URL}${user?.profileImage}` || profileImage} alt="profile" className="h-full w-full object-cover rounded-full" />
             
            </div>
            <span className="hidden lg:block text-sm font-semibold text-slate-700 capitalize">
              {user?.fullName?.split(" ")[0] || "User"}
            </span>
            <LuChevronDown size={14} className="text-slate-400 hidden lg:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-[210px] rounded-lg bg-white shadow-xl border border-slate-100 py-4 z-50">
              <div className="flex items-center gap-3 px-5 pb-3 border-b border-slate-100 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                <img src={`${constants.IMAGE_URL}${user?.profileImage}` || profileImage} alt="profile" className="h-full w-full object-cover rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 capitalize">{user?.fullName || "User"}</p>
                  <p className="text-xs text-slate-400 capitalize">{user?.role?.replace(/_/g, " ") || "Member"}</p>
                </div>
              </div>

              <button
                onClick={() => { setProfileOpen(false); navigate("/profile"); }}
                className="flex w-full items-center gap-3 px-5 py-2 text-sm text-slate-700 hover:text-blue-600 transition"
              >
                <LuUser size={18} />
                My Profile
              </button>
              <button
                onClick={() => { setProfileOpen(false); navigate("/settings"); }}
                className="flex w-full items-center gap-3 px-5 py-2 text-sm text-slate-700 hover:text-blue-600 transition"
              >
                <LuSettings size={18} />
                Settings
              </button>

              <div className="border-t border-slate-100 mx-5 my-2" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-5 py-2 text-sm text-slate-700 hover:text-blue-600 transition"
              >
                <LuLogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
