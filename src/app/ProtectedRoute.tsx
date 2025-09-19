import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (requireAdmin && user.user.role !== "admin") {
    alert("You are not allowed to access this page");
    return <Navigate to="/login" replace />;
  }

  return children;
};