import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthBox";

interface Props {
  allowedRoles?: string[];
}

export default function SafeGate({ allowedRoles }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
