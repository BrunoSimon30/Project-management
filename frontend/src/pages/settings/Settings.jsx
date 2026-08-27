import { useSelector } from "react-redux";

export default function Settings() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-8 bg-white rounded-md p-6">
      <h1 className="text-xl font-bold text-slate-800">Settings</h1>
      <div className="rounded-xl bg-white p-8 shadow-sm border border-slate-100 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Profile</h2>
          <p className="text-slate-600"><span className="font-medium">Name:</span> {user?.fullName || "—"}</p>
          <p className="text-slate-600"><span className="font-medium">Email:</span> {user?.email || "—"}</p>
          <p className="text-slate-600"><span className="font-medium">Role:</span> {user?.role?.replace(/_/g, " ") || "—"}</p>
        </div>
        <p className="text-slate-500 text-sm">Account settings and preferences will appear here. Connect to API when ready.</p>
      </div>
    </div>
  );
}
