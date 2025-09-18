import { Routes, Route, Navigate } from "react-router-dom";
import {LoginPage} from "../features/Auth/pages/LoginPage";
import ProjectsPage from "@/features/projects/pages/ProjectsPage";
import ImpactEntriesPage from "../features/impactEntries/pages/ImpactEntriesPage";
import ReportsPage from "@/features/reports/pages/ReportsPage";
import DonorsPage from "@/features/donors/pages/DonorsPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/projects" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/impact-entries" element={<ImpactEntriesPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/donors" element={<DonorsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}
