import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from "@/store/api/usersApi";
import { useGetDepartmentsQuery } from "@/store/api/departmentApi";
import constants from "@/utils/constants";
import DataTable from "react-data-table-component";
import CustomPagination from "@/components/CustomPagination";
import { LuMail, LuPencil, LuTrash2 } from "react-icons/lu";
import { FaRegCircleUser } from "react-icons/fa6";
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
      "&:hover": {
        backgroundColor: "#f8fafc",
      },
    },
  },
  table: {
    style: {
      borderRadius: "0.75rem",
    },
  },
};

const ROLES = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "department_head", label: "Department Head" },
  { value: "project_manager", label: "Project Manager" },
  { value: "team_lead", label: "Team Lead" },
  { value: "team_member", label: "Team Member" },
];

const inputClass = (error) =>
  `w-full rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:ring-2 ${error ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"}`;

export default function TeamMembers() {
  const { data: users } = useGetAllUsersQuery();
  const { data: deptData } = useGetDepartmentsQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [editingUser, setEditingUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const teamMembers = users?.data?.users ?? [];
  const departments = deptData?.data?.departments ?? [];

  const { register, getValues, reset, formState: { errors } } = useForm({
    defaultValues: { isVerified: false, role: "team_member", department: "" },
  });

  const handleEditOpen = (row) => {
    setEditingUser(row);
    const deptId = row.department?._id ?? row.department ?? "";
    reset({ isVerified: !!row.isVerified, role: row.role || "team_member", department: deptId || "" });
  };

  const handleUpdate = () => {
    if (!editingUser) return;
    const d = getValues();
    updateUser({
      id: editingUser._id,
      isVerified: d.isVerified,
      role: d.role,
      department: d.department || null,
    })
      .unwrap()
      .then(() => {
        toast.success("User updated successfully.");
        setEditingUser(null);
      })
      .catch((err) => toast.error(err?.data?.message || "Failed to update user."));
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId).unwrap();
      toast.success("User deleted successfully.");
      setDeleteId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user.");
    }
  };

  const columns = [
    {
      name: "Member",
      selector: (row) => row.fullName,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
            {row.profileImage ? <img src={`${constants.IMAGE_URL}${row.profileImage}`} alt="profile" className="w-10 h-10 rounded-full" />
              :
              <span className="hidden lg:block text-sm font-semibold text-slate-700 capitalize">
                <FaRegCircleUser size={20} />
              </span>
            }

          </div>
          <span className="font-medium text-slate-800 capitalize">{row?.fullName}</span>
        </div>
      ),
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      cell: (row) => <span className="text-slate-600 capitalize">{row?.role?.replace(/_/g, " ")}</span>,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => (
        <span className="flex items-center gap-2 text-slate-600">
          <LuMail size={14} className="shrink-0 text-slate-400" />
          {row.email}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.isVerified,
      sortable: true,
      cell: (row) => {
        const verified = row.isVerified === true;
        return (
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${verified ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}
          >
            {verified ? "Verified" : "Unverified"}
          </span>
        );
      },
    },
    {
      name: "Department",
      selector: (row) =>
        typeof row.department === "object" && row.department?.name
          ? row.department.name
          : typeof row.department === "string"
            ? row.department
            : "",
      sortable: true,
      cell: (row) => {
        const label =
          typeof row.department === "object" && row.department != null
            ? row.department.name
            : row.department;
        return (
          <span className="text-slate-600 capitalize">
            {label || "No department"}
          </span>
        );
      },
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
        title="Delete user?"
        description="This will soft-delete the user. They can be restored if needed."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        confirmLabel="Delete"
      />

      <EditDialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        title="Edit User"
        description="Update user role, verification and department."
        onSave={handleUpdate}
        onCancel={() => setEditingUser(null)}
        saveLabel="Update"
        isLoading={isUpdating}
      >
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isVerified"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              {...register("isVerified")}
            />
            <label htmlFor="isVerified" className="text-sm font-medium text-slate-700">
              Verified
            </label>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
            <select
              className={inputClass(errors.role)}
              {...register("role", { required: "Role is required" })}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <FieldError error={errors.role} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Department</label>
            <select className={inputClass(errors.department)} {...register("department")}>
              <option value="">No department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <FieldError error={errors.department} />
          </div>
        </div>
      </EditDialog>

      <h1 className="text-xl font-bold text-slate-800">Team Members</h1>

      <div className="rounded-md overflow-hidden bg-white shadow-sm border border-slate-100">
        <DataTable
          columns={columns}
          data={teamMembers}
          customStyles={customStyles}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 25]}
          paginationComponent={CustomPagination}
          noDataComponent={<span className="text-slate-500 py-8 block text-center">No team members found.</span>}
        />
      </div>
    </div>
  );
}
