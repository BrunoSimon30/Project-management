import { useState } from "react";
import DataTable from "react-data-table-component";
import CustomPagination from "@/components/CustomPagination";
import { useForm } from "react-hook-form";
import { LuBuilding2, LuPencil, LuTrash2 } from "react-icons/lu";
import { useDeleteDepartmentMutation, useCreateDepartmentMutation, useGetDepartmentsQuery, useUpdateDepartmentMutation } from "../../store/api/departmentApi";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { toast } from "sonner";
import { DeleteConfirmDialog, EditDialog } from "@/layouts/dialogs";
import FieldError from "../../utils/FieldError";

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
  table: { style: { borderRadius: "0.75rem" } },
};

const inputClass = (error) =>
  `w-full rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:ring-2 ${error ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
  }`;

export default function AllDepartments() {
  const { data, isLoading, isError, error } = useGetDepartmentsQuery();
  const [deleteDepartment, { isLoading: isDeleting }] = useDeleteDepartmentMutation();
  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const departments = data?.data?.departments ?? [];
  const [deleteId, setDeleteId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const { register, getValues, reset, formState: { errors } } = useForm({
    defaultValues: { name: "", description: "" },
  });

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDepartment(deleteId).unwrap();
      toast.success("Department deleted successfully.");
      setDeleteId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete department.");
    }
  };

  const handleCreateSave = () => {
    const d = getValues();
    if (!d.name?.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!d.description?.trim()) {
      toast.error("Description is required.");
      return;
    }
    createDepartment(d)
      .unwrap()
      .then(() => {
        toast.success("Department created successfully.");
        setCreateOpen(false);
        reset({ name: "", description: "" });
      })
      .catch((err) => toast.error(err?.data?.message || "Failed to create department."));
  };

  const handleEditOpen = (row) => {
    setEditingDepartment(row);
    reset({ name: row.name, description: row.description || "" });
  };

  const handleUpdate = () => {
    if (!editingDepartment) return;
    const d = getValues();
    if (!d.name?.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!d.description?.trim()) {
      toast.error("Description is required.");
      return;
    }
    updateDepartment({ id: editingDepartment._id, name: d.name, description: d.description })
      .unwrap()
      .then(() => {
        toast.success("Department updated successfully.");
        setEditingDepartment(null);
        reset({ name: "", description: "" });
      })
      .catch((err) => toast.error(err?.data?.message || "Failed to update department."));
  };

  const columns = [
    {
      name: "Department",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <LuBuilding2 size={20} />
          </div>
          <span className="font-medium text-slate-800">{row.name}</span>
        </div>
      ),
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      cell: (row) => (
        <span className="text-slate-600 line-clamp-2 max-w-md">{row.description}</span>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
            title="Edit"
            onClick={() => handleEditOpen(row)}
            disabled={isUpdating}
          >
            <LuPencil size={16} />
          </button>
          <button
            type="button"
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition cursor-pointer"
            title="Delete"
            onClick={() => setDeleteId(row._id)}
            disabled={isDeleting}
          >
            <LuTrash2 size={16} />
          </button>
        </div>
      ),
      width: "100px",
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="space-y-8 bg-white rounded-md p-6">
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete department?"
        description="This action cannot be undone. This will permanently delete the department."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        confirmLabel="Delete"
      />

      <EditDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Department"
        description="Add a new department."
        onSave={handleCreateSave}
        onCancel={() => reset({ name: "", description: "" })}
        saveLabel="Create"
        isLoading={isCreating}
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Engineering"
              className={inputClass(errors.name)}
              {...register("name", { required: "Name is required" })}
            />
            <FieldError error={errors.name} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of the department"
              className={inputClass(errors.description)}
              {...register("description", { required: "Description is required" })}
            />
            <FieldError error={errors.description} />
          </div>
        </div>
      </EditDialog>

      <EditDialog
        open={!!editingDepartment}
        onOpenChange={(open) => !open && setEditingDepartment(null)}
        title="Edit Department"
        description="Update department details."
        onSave={handleUpdate}
        onCancel={() => setEditingDepartment(null)}
        saveLabel="Update"
        isLoading={isUpdating}
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Engineering"
              className={inputClass(errors.name)}
              {...register("name", { required: "Name is required" })}
            />
            <FieldError error={errors.name} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of the department"
              className={inputClass(errors.description)}
              {...register("description", { required: "Description is required" })}
            />
            <FieldError error={errors.description} />
          </div>
        </div>
      </EditDialog>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-slate-800">All Departments</h1>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          <LuBuilding2 size={18} />
          Create Department
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <CgSpinnerTwoAlt size={32} className="animate-spin text-blue-600" />
        </div>
      )}
      {isError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error?.data?.message || error?.message || "Failed to load departments."}
        </p>
      )}
      {!isLoading && !isError && (
        <div className="rounded-md overflow-hidden bg-white shadow-sm border border-slate-100">
          <DataTable
            columns={columns}
            data={departments}
            customStyles={customStyles}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 25]}
            paginationComponent={CustomPagination}
            noDataComponent={
              <div className="flex items-center justify-center py-12">
                <p className="text-slate-600">No departments found.</p>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}