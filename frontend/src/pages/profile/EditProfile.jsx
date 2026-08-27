import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateProfileMutation } from "../../store/api/authApi";
import { setCredentials } from "../../store/slices/authSlice";
import { toast } from "sonner";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { FiCamera } from "react-icons/fi";
import { LuArrowLeft } from "react-icons/lu";
import constants from "../../utils/constants";
import FieldError from "../../utils/FieldError";
import { editProfileSchema } from "../../utils/Validator/authValidator";

const roles = [
    { value: "super_admin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "department_head", label: "Department Head" },
    { value: "project_manager", label: "Project Manager" },
    { value: "team_lead", label: "Team Lead" },
    { value: "team_member", label: "Team Member" },
];

const inputClass = (error) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:ring-2 ${error ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
    }`;

export default function EditProfile() {
    const { user } = useSelector((state) => state.auth);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const [profileFile, setProfileFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            fullName: user?.fullName || "",
            role: user?.role || "team_member",
        },
    });

    useEffect(() => {
        reset({
            fullName: user?.fullName || "",
            role: user?.role || "team_member",
        });
    }, [user?.fullName, user?.role, reset]);

    const handleProfileImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed");
            return;
        }
        setProfileFile(file);
        setProfilePreview(URL.createObjectURL(file));
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed");
            return;
        }
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        const name = data.fullName?.trim();
        if (name) formData.append("fullName", name);
        formData.append("role", data.role || "team_member");
        if (profileFile) formData.append("profileImage", profileFile);
        if (coverFile) formData.append("coverImage", coverFile);

        try {
            const result = await updateProfile(formData).unwrap();
            if (result?.data?.user) {
                dispatch(setCredentials({ user: result.data.user, token }));
            }
            toast.success(result?.message || "Profile updated successfully.");
            navigate("/profile");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update profile.");
        }
    };

    const profileImgSrc =
        profilePreview ||
        user?.profileImageUrl ||
        (user?.profileImage ? `${constants?.IMAGE_URL}${user?.profileImage}` : null);
    const coverImgSrc =
        coverPreview ||
        user?.coverImageUrl ||
        (user?.coverImage ? `${constants?.IMAGE_URL}${user?.coverImage}` : null);

    return (
        <div className="space-y-8 bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>

                    <h1 className="text-2xl font-bold text-slate-800">Edit Profile</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Update your personal information and photos
                    </p>
                </div>
                <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition mb-2"
                >
                    <LuArrowLeft size={18} />
                    Back to Profile
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="pb-6 relative">
                    <div className="absolute bottom-0 left-6 w-fit mx-auto z-10">
                        <div
                            onClick={() => profileInputRef.current?.click()}
                            className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-md cursor-pointer group ring-2 ring-slate-100"
                        >
                            {profileImgSrc ? (
                                <img
                                    src={profileImgSrc}
                                    alt="Profile"
                                    className="w-full h-full object-cover transition group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <FiCamera size={36} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <span className="text-white text-xs font-medium flex flex-col items-center gap-1">
                                    <FiCamera size={20} />
                                    Change
                                </span>
                            </div>
                        </div>
                        <input
                            ref={profileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="hidden"
                        />
                    </div>
                    <div
                        onClick={() => coverInputRef.current?.click()}
                        className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-200 border border-slate-200 cursor-pointer group"
                    >
                        {coverImgSrc ? (
                            <img
                                src={coverImgSrc}
                                alt="Cover"
                                className="w-full h-full object-cover transition group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <FiCamera size={40} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <span className="text-white text-sm font-medium flex items-center gap-2">
                                <FiCamera size={18} />
                                Change cover photo
                            </span>
                        </div>
                    </div>
                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="hidden"
                    />
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6">
                    <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
                        Basic information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Full name
                            </label>
                            <input
                                type="text"
                                {...register("fullName")}
                                placeholder="Enter your full name"
                                className={inputClass(errors.fullName)}
                                minLength={3}
                            />
                            <FieldError error={errors.fullName} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Role
                            </label>
                            <select
                                {...register("role")}
                                className={inputClass(errors.role) + " cursor-pointer"}
                            >
                                {roles.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                            <FieldError error={errors.role} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {isLoading ? (
                            <CgSpinnerTwoAlt className="animate-spin" size={20} />
                        ) : (
                            "Save changes"
                        )}
                    </button>
                    <Link
                        to="/profile"
                        className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
