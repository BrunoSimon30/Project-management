import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import AllProjects from "../pages/projects/AllProjects";
import AllTasks from "../pages/tasks/AllTasks";
import TeamMembers from "../pages/team/TeamMembers";
import Settings from "../pages/settings/Settings";
import SignUp from "../pages/authentication/SignUp";
import SignIn from "../pages/authentication/SignIn";
import VerifyOtp from "../pages/authentication/VerifyOtp";
import ResetPassword from "../pages/authentication/ResetPassword";
import Home from "../pages/Home";
import ForgotPassword from "../pages/authentication/forgotPassword";
import Profile from "../pages/profile/Profile";
import EditProfile from "../pages/profile/EditProfile";
import AllDepartments from "../pages/departments/AllDepartments";
import AddProject from "@/pages/projects/AddProject";
import EditProject from "@/pages/projects/EditProject";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/projects/add" element={<AddProject />} />
            <Route path="/projects/edit/:id" element={<EditProject />} />
            <Route path="/tasks" element={<AllTasks />} />
          
            <Route path="/team" element={<TeamMembers />} />
            <Route path="/departments" element={<AllDepartments />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
