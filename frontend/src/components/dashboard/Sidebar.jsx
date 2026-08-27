import { useState } from "react";
import { NavLink } from "react-router";
import {
  LuLayoutDashboard,
  LuFolderKanban,
  LuListTodo,
  LuUsers,
  LuBuilding2,
  LuSettings,
  LuChevronDown,
  LuX,
} from "react-icons/lu";

const navItems = [
  {
    label: "Main",
    items: [
      { to: "/dashboard", icon: LuLayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Apps",
    items: [
      {
        icon: LuFolderKanban,
        label: "Projects",
        children: [
          { to: "/projects", label: "All Projects" },
          { to: "/projects/add", label: "Create Project" },
        ],
      },
    
      { to: "/tasks", icon: LuListTodo, label: "Tasks" },
      { to: "/team", icon: LuUsers, label: "Team Members" },
      { to: "/departments", icon: LuBuilding2, label: "Departments" },
     
    ],
  },
  {
    label: "Others",
    items: [
      { to: "/settings", icon: LuSettings, label: "Settings" },
    ],
  },
];

const linkBase =
  "flex items-center gap-3 rounded-md px-[14px] py-[9px] text-sm font-medium transition-colors w-full";
const linkActive = "bg-blue-50 text-blue-600";
const linkInactive = "text-slate-500 hover:bg-slate-50 hover:text-slate-900";

function SidebarLink({ to, icon: Icon, label, onClose }) {
  return (
    <NavLink
      to={to}
      end={to === "/dashboard"}
      onClick={onClose}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? linkActive : linkInactive}`
      }
    >
      {Icon && <Icon size={20} className="shrink-0" />}
      <span>{label}</span>
    </NavLink>
  );
}

function SidebarAccordion({ icon: Icon, label, children, onClose }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-[5px]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${linkBase} ${linkInactive} justify-between`}
      >
        <span className="flex items-center gap-3">
          {Icon && <Icon size={20} className="shrink-0" />}
          <span>{label}</span>
        </span>
        <LuChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="mt-1 space-y-0.5 pl-4">
          {children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end={child.to === "/projects" || child.to === "/tasks"}
              onClick={onClose}
              className={({ isActive }) =>
                `block rounded-md px-3 py-[9px] text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col   bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-[25px]">
          <NavLink to="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              PM
            </div>
            <span className="text-lg font-bold text-slate-800">ProjectMan</span>
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-[25px] py-5">
          {navItems.map((section) => (
            <div key={section.label} className="mb-4">
              <span className="mb-[10px] block text-xs font-medium uppercase text-slate-400">
                {section.label}
              </span>
              <div className="space-y-[5px]">
                {section.items.map((item) =>
                  item.children ? (
                    <SidebarAccordion key={item.label} {...item} onClose={onClose} />
                  ) : (
                    <SidebarLink key={item.to} {...item} onClose={onClose} />
                  )
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 px-[25px] py-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} ProjectMan
          </p>
        </div>
      </aside>
    </>
  );
}
