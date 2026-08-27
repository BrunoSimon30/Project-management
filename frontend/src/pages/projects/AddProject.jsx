import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { LuFolderKanban, LuArrowLeft, LuImage, LuX } from "react-icons/lu";
import { useCreateProjectMutation } from "@/store/api/projectApi";
import { useGetDepartmentsQuery } from "@/store/api/departmentApi";
import { useGetAllUsersQuery } from "@/store/api/usersApi";
import { toast } from "sonner";
import FieldError from "@/utils/FieldError";

const STATUS_OPTIONS = [
    { value: "not_started", label: "Not Started" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "on_hold", label: "On Hold" },
];

const inputClass = (error) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:ring-2 ${error ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
    }`;

export default function AddProject() {
    const navigate = useNavigate();
    const [createProject, { isLoading }] = useCreateProjectMutation();
    const { data: deptData } = useGetDepartmentsQuery();
    const { data: usersData } = useGetAllUsersQuery();
    const departments = deptData?.data?.departments ?? [];
    const users = usersData?.data?.users ?? [];

    const fileInputRef = useRef(null);
    const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            description: "",
            status: "not_started",
            startDate: "",
            endDate: "",
            department: "",
            projectManager: "",
            githubLink: "",
            liveLink: "",
            projectIcon: null,
        },
    });

    const onSubmit = (data) => {
        if (!data.name?.trim()) {
            toast.error("Name is required.");
            return;
        }
        const file = data.projectIcon?.[0];
        const body = file
            ? (() => {
                const form = new FormData();
                form.append("name", data.name.trim());
                form.append("description", data.description?.trim() || "");
                form.append("status", data.status);
                if (data.startDate) form.append("startDate", data.startDate);
                if (data.endDate) form.append("endDate", data.endDate);
                if (data.department) form.append("department", data.department);
                if (data.projectManager) form.append("projectManager", data.projectManager);
                form.append("githubLink", data.githubLink?.trim() || "");
                form.append("liveLink", data.liveLink?.trim() || "");
                form.append("projectIcon", file);
                return form;
            })()
            : {
                name: data.name.trim(),
                description: data.description?.trim() || "",
                status: data.status,
                startDate: data.startDate || undefined,
                endDate: data.endDate || undefined,
                department: data.department || undefined,
                projectManager: data.projectManager || undefined,
                githubLink: data.githubLink?.trim() || "",
                liveLink: data.liveLink?.trim() || "",
            };
        createProject(body)
            .unwrap()
            .then(() => {
                toast.success("Project created successfully.");
                navigate("/projects");
            })
            .catch((err) => toast.error(err?.data?.message || "Failed to create project."));
    };

    return (
        <div className="  space-y-8 bg-white rounded-md p-6">
            <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <LuFolderKanban size={20} />
                    </div>
                    <h1 className="text-xl font-bold text-slate-800">Create Project</h1>
                </div>
                <Link
                    to="/projects"
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition flex items-center gap-2"
                    aria-label="Back to projects"
                >
                    <LuArrowLeft size={20} />
                    <span className="text-sm font-medium text-slate-500">Back to projects</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Project name"
                        className={inputClass(errors.name)}
                        {...register("name", { required: "Name is required" })}
                    />
                    <FieldError error={errors.name} />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
                    <textarea
                        rows={4}
                        placeholder="Brief description of the project"
                        className={inputClass(errors.description)}
                        {...register("description")}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">GitHub repo</label>
                        <input
                            type="url"
                            placeholder="https://github.com/username/repo"
                            className={inputClass(errors.githubLink)}
                            {...register("githubLink")}
                        />
                        <p className="mt-1 text-xs text-slate-500">Optional. Link to the project repository.</p>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Live link</label>
                        <input
                            type="url"
                            placeholder="https://example.com"
                            className={inputClass(errors.liveLink)}
                            {...register("liveLink")}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
                        <select className={inputClass(errors.status)} {...register("status")}>
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>





                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Start Date</label>
                        <input type="date" className={inputClass(errors.startDate)} {...register("startDate")} />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">End Date</label>
                        <input type="date" className={inputClass(errors.endDate)} {...register("endDate")} />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Department</label>
                        <select className={inputClass(errors.department)} {...register("department")}>
                            <option value="">No department</option>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Project Manager</label>
                        <select className={inputClass(errors.projectManager)} {...register("projectManager")}>
                            <option value="">None</option>
                            {users.map((u) => (
                                <option key={u._id} value={u._id}>{u.fullName}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Project icon / image</label>
                    <div
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                        onClick={() => fileInputRef.current?.click()}
                        className="relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 transition hover:border-blue-300 hover:bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    >
                        <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            {...register("projectIcon")}
                            ref={(el) => {
                                register("projectIcon").ref(el);
                                fileInputRef.current = el;
                            }}
                        />
                        {watch("projectIcon")?.[0] ? (
                            <div className="flex flex-col items-center gap-2">
                                <img
                                    src={URL.createObjectURL(watch("projectIcon")[0])}
                                    alt="Preview"
                                    className="h-20 w-20 rounded-lg object-cover ring-2 ring-slate-200"
                                />
                                <span className="text-xs text-slate-600">{watch("projectIcon")[0].name}</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                        className="text-xs font-medium text-blue-600 hover:underline"
                                    >
                                        Change
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setValue("projectIcon", null);
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                        }}
                                        className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-600"
                                    >
                                        <LuX size={12} /> Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <LuImage className="mb-2 text-slate-400" size={32} />
                                <span className="text-sm font-medium text-slate-600">Click or drag to upload</span>
                                <span className="mt-0.5 text-xs text-slate-500">PNG, JPG up to 5MB</span>
                            </>
                        )}
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">Optional. Icon or thumbnail to identify the project.</p>
                </div>



                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {isLoading ? "Creating…" : "Create Project"}
                    </button>
                    <Link
                        to="/projects"
                        className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
