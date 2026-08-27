import DataTable from "react-data-table-component";
import {
  LuFolderKanban,
  LuFolderCheck,
  LuUsers,
  LuTrendingUp,
  LuTrendingDown,
  LuEye,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";

const stats = [
  {
    label: "Total Projects",
    value: "1235",
    sub: "Projects this month",
    trend: "+10%",
    trendUp: true,
    icon: LuFolderKanban,
    cardBg: "bg-violet-50/80",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    label: "Active Projects",
    value: "425",
    sub: "Projects this month",
    trend: "+5.75%",
    trendUp: true,
    icon: LuFolderKanban,
    cardBg: "bg-orange-50/80",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    label: "Finished Projects",
    value: "135",
    sub: "Projects this month",
    trend: "-15%",
    trendUp: false,
    icon: LuFolderCheck,
    cardBg: "bg-green-50/80",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Team Members",
    value: "65+",
    sub: "Hard Workers",
    icon: LuUsers,
    cardBg: "bg-violet-50/80",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
];

const demoProjects = [
  {
    id: "850",
    name: "Project CyberSphere",
    client: "NovaTech Solutions",
    assignees: ["JD", "MK", "AL", "+1"],
    budget: "4,500",
    startDate: "25 Mar 2024",
    endDate: "25 Apr 2024",
    status: "Finished",
  },
  {
    id: "851",
    name: "Digital Oasis Initiative",
    client: "AlphaWave Innovations",
    assignees: ["SK", "PM", "RN"],
    budget: "6,800",
    startDate: "20 Mar 2024",
    endDate: "20 Apr 2024",
    status: "In Progress",
  },
  {
    id: "852",
    name: "CloudScape Evolution",
    client: "InnovateIQ Inc.",
    assignees: ["TW", "HL"],
    budget: "2,500",
    startDate: "15 Mar 2024",
    endDate: "15 Apr 2024",
    status: "Pending",
  },
  {
    id: "853",
    name: "Data Dynamo Drive",
    client: "BlueSky Technologies",
    assignees: ["CV", "BX", "NM", "+1"],
    budget: "7,500",
    startDate: "10 Mar 2024",
    endDate: "10 Apr 2024",
    status: "In Progress",
  },
];

const tableStyles = {
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
};

const projectColumns = [
  { name: "ID", selector: (row) => row.id, sortable: true, cell: (row) => <span className="font-medium text-slate-500">#{row.id}</span>, width: "80px" },
  { name: "Project Name", selector: (row) => row.name, sortable: true, cell: (row) => <span className="font-medium text-slate-800">{row.name}</span> },
  { name: "Client", selector: (row) => row.client, sortable: true, cell: (row) => <span className="text-slate-600">{row.client}</span> },
  {
    name: "Assignees",
    cell: (row) => (
      <div className="flex -space-x-2">
        {row.assignees.map((a, i) =>
          a.startsWith("+") ? (
            <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white ring-2 ring-white">
              {a}
            </div>
          ) : (
            <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 ring-2 ring-white">
              {a}
            </div>
          )
        )}
      </div>
    ),
    width: "140px",
  },
  { name: "Budget", selector: (row) => row.budget, sortable: true, cell: (row) => <span className="text-slate-600">${row.budget}</span>, width: "100px" },
  { name: "Start Date", selector: (row) => row.startDate, sortable: true, cell: (row) => <span className="text-slate-500">{row.startDate}</span> },
  { name: "End Date", selector: (row) => row.endDate, sortable: true, cell: (row) => <span className="text-slate-500">{row.endDate}</span> },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    cell: (row) => (
      <span
        className={`inline-block rounded-full px-3 py-1.5 text-xs font-medium ${row.status === "Finished"
            ? "bg-green-100 text-green-700"
            : row.status === "In Progress"
              ? "bg-orange-100 text-orange-700"
              : "bg-violet-100 text-violet-700"
          }`}
      >
        {row.status}
      </span>
    ),
    width: "120px",
  },
  {
    name: "Action",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <button type="button" className="text-slate-400 hover:text-blue-600 transition" title="View">
          <LuEye size={18} />
        </button>
        <button type="button" className="text-slate-400 hover:text-green-600 transition" title="Edit">
          <LuPencil size={18} />
        </button>
        <button type="button" className="text-slate-400 hover:text-red-500 transition" title="Delete">
          <LuTrash2 size={18} />
        </button>
      </div>
    ),
    width: "120px",
    ignoreRowClick: true,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 bg-white rounded-md p-6">
      {/* Page title */}
      <h1 className="text-xl font-bold text-slate-800">Projects Overview</h1>

      {/* Stats Grid - light tinted cards with spacing */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, sub, trend, trendUp, icon: Icon, cardBg, iconBg, iconColor }) => (
          <div
            key={label}
            className={`rounded-md ${cardBg} p-6 shadow-sm border border-white/50`}
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon size={24} className={iconColor} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <p className="text-xs text-slate-500">{sub}</p>
              {trend && (
                <span
                  className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}
                >
                  {trendUp ? <LuTrendingUp size={12} /> : <LuTrendingDown size={12} />}
                  {trend}
                </span>
              )}
              {label === "Team Members" && (
                <div className="flex -space-x-2 shrink-0">
                  {["A", "B", "C"].map((letter, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-200 text-xs font-bold text-violet-700 ring-2 ring-white"
                    >
                      {letter}
                    </div>
                  ))}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white ring-2 ring-white">
                    +55
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* All Projects Table */}
      <div className="rounded-sm bg-white shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">All Projects</h2>
          <select className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>

        <DataTable
          columns={projectColumns}
          data={demoProjects}
          customStyles={tableStyles}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 25]}
          noDataComponent={<span className="text-slate-500 py-8 block text-center">No projects found.</span>}
        />
      </div>


    </div>
  );
}
