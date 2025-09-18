import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../features/Auth/pages/LoginPage";
import ProjectsPage from "@/features/projects/pages/ProjectsPage";
import ImpactEntriesPage from "../features/impactEntries/pages/ImpactEntriesPage";
import ReportsPage from "@/features/reports/pages/ReportsPage";
import { useAuth } from "@/context/AuthContext";

// ProtectedRoute: blocks admins from accessing certain routes
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuth();

  // If user is admin, redirect to login or home page
  if (user?.role === "admin") {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, allow access
  return children;
};

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/projects" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/impact-entries"
        element={
          <ProtectedRoute>
            <ImpactEntriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
