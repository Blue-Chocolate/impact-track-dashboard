import React, { type ReactNode, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: "/projects", label: "Projects", icon: "📁" },
    { to: "/impact-entries", label: "Impact Entries", icon: "📊" },
    { to: "/reports", label: "Reports", icon: "📈" },
    { to: "/donors", label: "Donors", icon: "💰" },
    { to: "/settings", label: "Settings", icon: "⚙️" }
  ];

  // Simple gradient avatar from name
  const initials = (user?.name || "Guest")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();           // clear localStorage + context
    navigate("/login"); // redirect
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-card transform transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-2xl font-bold text-primary-600">ImpactTrack</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm font-medium
                ${
                  isActive
                    ? "bg-primary-500 text-dark shadow-soft"
                    : "text-slate-700 hover:bg-primary-50 hover:text-primary-700"
                }`
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-md bg-danger text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white shadow-soft flex items-center justify-between px-6">
          <button
            className="md:hidden text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>

          <div className="flex items-center gap-3">
            <span className="text-slate-700 hidden sm:block">
              {user?.name || "Guest"}
            </span>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold shadow-soft"
              style={{
                background: "linear-gradient(135deg, #6c63ff, #9f7aea)",
              }}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};
