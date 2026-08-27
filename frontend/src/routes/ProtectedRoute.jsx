import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/signin" replace />;
  if (user && !user.isVerified) return <Navigate to="/verify-otp" replace />;

  return <Outlet />;
}
