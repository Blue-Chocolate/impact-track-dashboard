import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<div>Projects Page</div>} />
        <Route path="/reports" element={<div>Reports Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
      </Route>
    </Routes>
  );
}

export default App;
