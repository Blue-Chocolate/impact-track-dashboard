import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col transition-transform duration-300">
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-2xl font-bold text-blue-600">ImpactTrack</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            📁 Projects
          </NavLink>
          <NavLink
            to="/impact-entries"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            📊 Impact Entries
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            📈 Reports
          </NavLink>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <button className="md:hidden text-gray-600">
            ☰
          </button>
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <div className="flex items-center space-x-3">
            <span className="text-gray-700">{user?.name || "Guest"}</span>
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name || "Guest"}&background=0D8ABC&color=fff`}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
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
