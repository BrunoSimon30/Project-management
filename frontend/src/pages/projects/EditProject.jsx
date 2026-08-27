import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { LuArrowLeft, LuFolderKanban, LuImage, LuX } from "react-icons/lu";
import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from "@/store/api/projectApi";
import { useGetDepartmentsQuery } from "@/store/api/departmentApi";
import { useGetAllUsersQuery } from "@/store/api/usersApi";
import FieldError from "@/utils/FieldError";
import constants from "@/utils/constants";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

const inputClass = (error) =>
  `w-full rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:ring-2 ${error ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"}`;

export default function EditProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const stateProject = location.state?.project;

  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const { data: projectData, isLoading: isProjectLoading } = useGetProjectByIdQuery(id, {
    skip: !id,
  });
  const { data: deptData } = useGetDepartmentsQuery();
  const { data: usersData } = useGetAllUsersQuery();

  const departments = deptData?.data?.departments ?? [];
  const users = usersData?.data?.users ?? [];
  const project = stateProject || projectData?.data;

  const fileInputRef = useRef(null);
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
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

  useEffect(() => {
    if (!project) return;
    reset({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "not_started",
      startDate: project.startDate ? new Date(project.startDate).toISOString().slice(0, 10) : "",
      endDate: project.endDate ? new Date(project.endDate).toISOString().slice(0, 10) : "",
      department: project.department?._id || project.department || "",
      projectManager: project.projectManager?._id || project.projectManager || "",
      githubLink: project.githubLink || "",
      liveLink: project.liveLink || "",
      projectIcon: null,
    });
  }, [project, reset]);

  const onSubmit = (data) => {
    if (!id) return;
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
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        department: data.department || "",
        projectManager: data.projectManager || "",
        githubLink: data.githubLink?.trim() || "",
        liveLink: data.liveLink?.trim() || "",
      };

    updateProject({ id, body })
      .unwrap()
      .then(() => {
        toast.success("Project updated successfully.");
        navigate("/projects");
      })
      .catch((err) => toast.error(err?.data?.message || "Failed to update project."));
  };

  const existingImage = project?.image?.file ? `${constants.IMAGE_URL}${project.image.file}` : null;

  if (!project && isProjectLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-slate-500">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 rounded-md bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <LuFolderKanban size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Edit Project</h1>
        </div>
        <Link
          to="/projects"
          className="flex items-center gap-2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
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
            className="relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 transition hover:border-blue-300 hover:bg-blue-50/30"
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
            ) : existingImage ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={existingImage}
                  alt="Current project"
                  className="h-20 w-20 rounded-lg object-cover ring-2 ring-slate-200"
                />
                <span className="text-xs text-slate-600">Current image (click to change)</span>
              </div>
            ) : (
              <>
                <LuImage className="mb-2 text-slate-400" size={32} />
                <span className="text-sm font-medium text-slate-600">Click to upload</span>
                <span className="mt-0.5 text-xs text-slate-500">PNG, JPG up to 5MB</span>
              </>
            )}
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Optional. Upload only if you want to replace existing image.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isUpdating}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {isUpdating ? "Updating..." : "Update Project"}
          </button>
          <Link
            to="/projects"
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
