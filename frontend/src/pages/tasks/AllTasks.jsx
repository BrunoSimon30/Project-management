import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import CustomPagination from "@/components/CustomPagination";
import { useForm } from "react-hook-form";
import { LuListTodo, LuSearch, LuPencil, LuTrash2, LuPlus } from "react-icons/lu";
import { toast } from "sonner";
import { DeleteConfirmDialog, EditDialog } from "@/layouts/dialogs";
import FieldError from "@/utils/FieldError";

const customStyles = {
  headCells: {
    style: {
      paddingLeft: "1.5rem",
      paddingRight: "1.5rem",
      paddingTop: "1rem",
      paddingBottom: "1rem",
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#475569",
      backgroundColor: "#f8fafc",
      borderBottom: "1px solid #e2e8f0",
    },
  },
  cells: {
    style: {
      paddingLeft: "1.5rem",
      paddingRight: "1.5rem",
      paddingTop: "1rem",
      paddingBottom: "1rem",
      fontSize: "0.875rem",
    },
  },
  rows: {
    style: {
      borderBottom: "1px solid #f1f5f9",
      "&:hover": { backgroundColor: "#f8fafc" },
    },
  },
  table: {
    style: { borderRadius: "0.75rem" },
  },
};

/** Demo seed — replace with API later */
const DUMMY_TASKS = [
  {
    id: "1",
    title: "Design landing page hero",
    description: "Hero copy, gradient and CTA.",
    status: "todo",
    priority: "high",
    projectName: "Marketing site",
    assignee: "Sara Khan",
    dueDate: "2026-03-22",
  },
  {
    id: "2",
    title: "API error handling audit",
    description: "Consistent ApiError on routes.",
    status: "todo",
    priority: "medium",
    projectName: "Core API",
    assignee: "Unassigned",
    dueDate: "2026-03-25",
  },
  {
    id: "3",
    title: "Implement task model",
    description: "Schema, validators, indexes.",
    status: "in_progress",
    priority: "high",
    projectName: "Core API",
    assignee: "Danish Patel",
    dueDate: "2026-03-18",
  },
  {
    id: "4",
    title: "Team table department column",
    description: "Show name; fix edit modal.",
    status: "in_progress",
    priority: "low",
    projectName: "Admin UI",
    assignee: "Sara Khan",
    dueDate: "2026-03-20",
  },
  {
    id: "5",
    title: "Deploy staging to VPS",
    description: "Env, PM2, nginx.",
    status: "done",
    priority: "medium",
    projectName: "Infrastructure",
    assignee: "Danish Patel",
    dueDate: "2026-03-15",
  },
  {
    id: "6",
    title: "Write README setup steps",
    description: "Node, Mongo, VITE_API_URL.",
    status: "done",
    priority: "low",
    projectName: "Docs",
    assignee: "Sara Khan",
    dueDate: "2026-03-10",
  },
];

const STATUS_LABEL = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

const STATUS_BADGE = {
  todo: "bg-slate-100 text-slate-700",
  in_progress: "bg-blue-100 text-blue-800",
  done: "bg-emerald-100 text-emerald-800",
};

const PRIORITY_BADGE = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-700",
};

const emptyTaskForm = {
  title: "",
  description: "",
  projectName: "",
  assignee: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

const inputClass = (error) =>
  `w-full rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:ring-2 ${error ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
  }`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

function taskFormFields(register, errors, projectNames, assigneeNames) {
  return (
    <div className="space-y-4 py-2">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="What needs to be done?"
          className={inputClass(errors.title)}
          {...register("title", { required: "Title is required" })}
        />
        <FieldError error={errors.title} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          rows={3}
          placeholder="Optional context"
          className={inputClass(errors.description)}
          {...register("description")}
        />
        <FieldError error={errors.description} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Project</label>
          <select className={inputClass(errors.projectName)} {...register("projectName")}>
            <option value="">Select project</option>
            {projectNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Assignee</label>
          <select className={inputClass(errors.assignee)} {...register("assignee")}>
            <option value="">Unassigned</option>
            {assigneeNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
          <select className={inputClass(errors.status)} {...register("status")}>
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Priority</label>
          <select className={inputClass(errors.priority)} {...register("priority")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Due date</label>
        <input type="date" className={inputClass(errors.dueDate)} {...register("dueDate")} />
        <FieldError error={errors.dueDate} />
      </div>
    </div>
  );
}

export default function AllTasks() {
  const [tasks, setTasks] = useState(DUMMY_TASKS);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { register, getValues, reset, trigger, formState: { errors } } = useForm({
    defaultValues: emptyTaskForm,
  });

  const projectNames = useMemo(() => {
    const s = new Set(tasks.map((t) => t.projectName).filter(Boolean));
    return [...s].sort();
  }, [tasks]);

  const assigneeNames = useMemo(() => {
    const s = new Set(tasks.map((t) => t.assignee).filter(Boolean));
    s.delete("Unassigned");
    return [...s].sort();
  }, [tasks]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.assignee || "").toLowerCase().includes(q);
      const matchProject = !projectFilter || t.projectName === projectFilter;
      const matchStatus = !statusFilter || t.status === statusFilter;
      return matchSearch && matchProject && matchStatus;
    });
  }, [tasks, search, projectFilter, statusFilter]);

  const normalizeTaskPayload = (d) => ({
    title: d.title.trim(),
    description: (d.description || "").trim(),
    projectName: (d.projectName || "").trim(),
    assignee: (d.assignee || "").trim() || "Unassigned",
    status: d.status,
    priority: d.priority,
    dueDate: d.dueDate || "",
  });

  const handleCreateSave = async () => {
    const ok = await trigger();
    if (!ok) return;
    const d = getValues();
    const payload = normalizeTaskPayload(d);
    setTasks((prev) => [
      ...prev,
      { id: String(Date.now()), ...payload },
    ]);
    toast.success("Task created successfully.");
    setCreateOpen(false);
    reset(emptyTaskForm);
  };

  const handleEditOpen = (row) => {
    setEditingTask(row);
    reset({
      title: row.title,
      description: row.description || "",
      projectName: row.projectName || "",
      assignee: row.assignee === "Unassigned" ? "" : row.assignee || "",
      status: row.status,
      priority: row.priority,
      dueDate: row.dueDate || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingTask) return;
    const ok = await trigger();
    if (!ok) return;
    const d = getValues();
    const payload = normalizeTaskPayload(d);
    setTasks((prev) =>
      prev.map((t) => (t.id === editingTask.id ? { ...t, ...payload } : t))
    );
    toast.success("Task updated successfully.");
    setEditingTask(null);
    reset(emptyTaskForm);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    setTasks((prev) => prev.filter((t) => t.id !== deleteId));
    toast.success("Task deleted successfully.");
    setDeleteId(null);
  };

  const columns = [
    {
      name: "Task",
      selector: (row) => row.title,
      sortable: true,
      grow: 2,
      cell: (row) => (
        <div className="min-w-0 max-w-md">
          <p className="font-medium text-slate-800">{row.title}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{row.description}</p>
        </div>
      ),
    },
    {
      name: "Project",
      selector: (row) => row.projectName,
      sortable: true,
      cell: (row) => (
        <span className="text-slate-600">{row.projectName || "—"}</span>
      ),
    },
    {
      name: "Assignee",
      selector: (row) => row.assignee,
      sortable: true,
      cell: (row) => (
        <span className="text-slate-600 capitalize">{row.assignee || "Unassigned"}</span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[row.status] ?? "bg-slate-100 text-slate-700"}`}
        >
          {STATUS_LABEL[row.status] ?? row.status}
        </span>
      ),
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
      cell: (row) => (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${PRIORITY_BADGE[row.priority] ?? "bg-slate-100"}`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      name: "Due",
      selector: (row) => row.dueDate,
      sortable: true,
      cell: (row) => <span className="text-slate-600">{formatDate(row.dueDate)}</span>,
    },
    {
      name: "Actions",
      width: "110px",
      ignoreRowClick: true,
      cell: (row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
            title="Edit"
            onClick={() => handleEditOpen(row)}
          >
            <LuPencil size={16} />
          </button>
          <button
            type="button"
            className="rounded p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
            title="Delete"
            onClick={() => setDeleteId(row.id)}
          >
            <LuTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 rounded-md bg-white p-6">
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete task?"
        description="This action cannot be undone. This will permanently remove the task."
        onConfirm={handleConfirmDelete}
        confirmLabel="Delete"
      />

      <EditDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Task"
        description="Add a new task."
        onSave={handleCreateSave}
        onCancel={() => reset(emptyTaskForm)}
        saveLabel="Create"
        contentClassName="sm:max-w-lg"
      >
        {taskFormFields(register, errors, projectNames, assigneeNames)}
      </EditDialog>

      <EditDialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        title="Edit Task"
        description="Update task details."
        onSave={handleUpdate}
        onCancel={() => setEditingTask(null)}
        saveLabel="Update"
        contentClassName="sm:max-w-lg"
      >
        {taskFormFields(register, errors, projectNames, assigneeNames)}
      </EditDialog>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <LuListTodo size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Tasks</h1>
            <p className="text-sm text-slate-500">Table view · local demo</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <LuPlus size={18} />
          New task
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="min-w-[200px] flex-1">
          <label htmlFor="tasks-search" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Search
          </label>
          <div className="relative">
            <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="tasks-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Title, description, assignee…"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        <div className="min-w-[160px]">
          <label htmlFor="tasks-project-filter" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Project
          </label>
          <select
            id="tasks-project-filter"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All</option>
            {projectNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[140px]">
          <label htmlFor="tasks-status-filter" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Status
          </label>
          <select
            id="tasks-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All</option>
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <p className="text-xs text-slate-500 lg:ml-auto">
          <strong className="text-slate-700">{filtered.length}</strong> / {tasks.length} rows
        </p>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-100 shadow-sm">
        <DataTable
          columns={columns}
          data={filtered}
          customStyles={customStyles}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 25]}
          paginationComponent={CustomPagination}
          noDataComponent={
            <span className="block py-10 text-center text-slate-500">No tasks match your filters.</span>
          }
        />
      </div>
    </div>
  );
}
