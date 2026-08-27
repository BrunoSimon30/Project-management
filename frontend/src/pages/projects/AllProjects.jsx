import { useState } from "react";
import { Link } from "react-router";
import {
  LuFolderKanban,
  LuTrash2,
  LuGithub,
  LuUser,
  LuBuilding2,
  LuCalendarDays,
  LuClock3,
  LuPencil,
} from "react-icons/lu";
import { IoEarthOutline } from "react-icons/io5";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { useDeleteProjectMutation, useGetProjectsQuery } from "@/store/api/projectApi";
import { DeleteConfirmDialog } from "@/layouts/dialogs";
import constants from "@/utils/constants";
import { toast } from "sonner";
import { useGetAllUsersQuery } from "@/store/api/usersApi";

const STATUS_MAP = {
  not_started: { label: "Not Started", class: "bg-slate-100 text-slate-600" },
  in_progress: { label: "In Progress", class: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", class: "bg-green-100 text-green-700" },
  on_hold: { label: "On Hold", class: "bg-amber-100 text-amber-700" },
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "—";
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="truncate text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}

export default function AllProjects() {
  const { data: projectsData, isLoading, isError, error } = useGetProjectsQuery();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const { data: users } = useGetAllUsersQuery();
  const teamMembers = users?.data?.users ?? [];
  const [selectedProject, setSelectedProject] = useState(null);
  const projects = projectsData?.data?.projects ?? projectsData?.data ?? [];
  console.log(teamMembers, 'teamMembers');



  const handleConfirmDelete = async () => {
    if (!selectedProject?._id) return;
    try {
      await deleteProject(selectedProject._id).unwrap();
      toast.success("Project deleted successfully.");
      setSelectedProject(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete project.");
    }
  };

  return (
    <div className="space-y-8 rounded-md bg-white p-6">
      <DeleteConfirmDialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
        title="Delete project?"
        description={`This action cannot be undone. "${selectedProject?.name ?? "Project"}" will be permanently deleted.`}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        confirmLabel="Delete"
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-slate-800">All Projects</h1>
        <Link
          to="/projects/add"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <LuFolderKanban size={18} />
          Create Project
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <CgSpinnerTwoAlt className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 py-8 text-center">
          <p className="text-red-700">{error?.data?.message ?? "Failed to load projects."}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-16">
          <p className="text-slate-600">No projects found.</p>
          <Link
            to="/projects/add"
            className="mt-3 text-sm font-medium text-blue-600 hover:underline"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const status = STATUS_MAP[project.status] ?? STATUS_MAP.not_started;
            const imageSrc = project.image?.file
              ? `${constants.IMAGE_URL}${project.image.file}`
              : null;

            return (
              <article
                key={project._id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="space-y-5 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                        {imageSrc ? (
                          <img src={imageSrc} alt={project.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-blue-600">
                            <LuFolderKanban size={30} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-2xl font-bold text-slate-800">{project.name}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {project.description || "No description available."}
                        </p>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${status.class}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="grid gap-4 border-y border-slate-100 py-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <InfoRow icon={<LuCalendarDays size={18} />} label="Start Date" value={formatDate(project.startDate)} />
                      <InfoRow icon={<LuCalendarDays size={18} />} label="End Date" value={formatDate(project.endDate)} />
                    </div>
                    <div className="space-y-3 sm:border-l sm:border-slate-100 sm:pl-4">
                      <div className="flex items-center gap-2">
                        <img src={`${constants.IMAGE_URL}${project.projectManager?.profileImage?.file}`} alt={project.projectManager?.fullName} className="h-10 w-10 rounded-full" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800 capitalize">{project.projectManager?.fullName || "—"}</p>
                          <p className="text-xs text-slate-500 capitalize">{project.projectManager?.role?.replace(/_/g, " ") || "—"}</p>
                        </div>
                      </div>
                      <InfoRow icon={<LuBuilding2 size={18} />} label="Department" value={project.department?.name || "—"} />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <a
                      href={project.githubLink || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group rounded-2xl border px-4 py-3 transition ${project.githubLink
                        ? "border-slate-200 hover:border-blue-200 hover:bg-blue-50/30"
                        : "cursor-not-allowed border-slate-100 bg-slate-50"
                        }`}
                      onClick={(e) => !project.githubLink && e.preventDefault()}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <LuGithub size={20} className={project.githubLink ? "text-slate-700" : "text-slate-400"} />
                          <p className="text-sm font-semibold text-slate-800">Repository</p>
                        </div>
                      </div>
                    </a>

                    <a
                      href={project.liveLink || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group rounded-2xl border px-4 py-3 transition ${project.liveLink
                        ? "border-slate-200 hover:border-blue-200 hover:bg-blue-50/30"
                        : "cursor-not-allowed border-slate-100 bg-slate-50"
                        }`}
                      onClick={(e) => !project.liveLink && e.preventDefault()}
                    >
                      <div className="flex items-center gap-2">
                        <IoEarthOutline size={20} className={project.liveLink ? "text-blue-600" : "text-slate-400"} />
                        <p className="text-sm font-semibold text-slate-800">Live Demo</p>
                      </div>
                    </a>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                    <div className="flex items-center">
                      {teamMembers.map((m, i) =>
                        m.department === project.department.name ? (
                          <img
                            key={i}
                            src={`${constants.IMAGE_URL}${m.profileImage}`}
                            alt={m.fullName}
                            className="w-10 h-10 rounded-full border-2 border-white -ml-2 first:ml-0 object-cover"
                          />
                        ) : null
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/projects/edit/${project._id}`}
                        state={{ project }}
                        className="rounded-xl border border-blue-200 p-2 text-blue-500 transition hover:bg-red-50"
                        title="Edit"
                      >
                        <LuPencil size={16} />
                      </Link>
                      <button
                        type="button"
                        className="rounded-xl border border-red-200 p-2 text-red-500 transition hover:bg-red-50"
                        title="Delete"
                        onClick={() => setSelectedProject(project)}
                      >
                        <LuTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>


              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
