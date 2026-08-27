import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router";
 

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7fa] ">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Spacing between sidebar and content (vertical line area) */}
      <div className="flex flex-1 flex-col   overflow-y-auto px-5 md:px-[25px] relative">
      <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 py-6">
          <Outlet />

        </main>
      </div>
    </div>
  );
}
