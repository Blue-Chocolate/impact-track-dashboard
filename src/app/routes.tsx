import { Routes, Route, Navigate } from "react-router-dom";
import {LoginPage} from "../features/Auth/pages/LoginPage";
import ProjectsPage from "@/features/projects/pages/ProjectsPage";
import ImpactEntriesPage from "@/features/impactEntries/pages/ImpactEntriesPage";
import ReportsPage from "@/features/reports/pages/ReportsPage";

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/projects" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/impacts" element={<ImpactEntriesPage />} />
      <Route path="/reports" element={<ReportsPage />} />
    </Routes>
  );
}
