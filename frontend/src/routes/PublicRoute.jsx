import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

export default function PublicRoute() {
  const { token, user } = useSelector((state) => state.auth);
  const location = useLocation();

  const isForgotPasswordFlow =
    location.pathname === "/verify-otp" &&
    localStorage.getItem("forgotPasswordFlow") === "true";

  if (
    token &&
    user?.isVerified &&
    location.pathname !== "/reset-password" &&
    !isForgotPasswordFlow
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}