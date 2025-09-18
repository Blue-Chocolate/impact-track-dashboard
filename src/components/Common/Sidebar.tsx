import { Link, useLocation } from "react-router-dom";

// ✅ Sidebar
export function Sidebar() {
  const location = useLocation();
  const links = [
    { to: "/projects", label: "Projects", icon: "📂" },
    { to: "/impacts", label: "Impacts", icon: "📊" },
    { to: "/reports", label: "Reports", icon: "📑" },
  ];

  return (
    <aside className="w-64 bg-white shadow-card h-screen p-6 hidden md:flex flex-col">
      <nav className="space-y-2">
        {links.map((link) => {
          const active = location.pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition 
                ${
                  active
                    ? "bg-primary-500 text-white shadow-soft"
                    : "text-slate-700 hover:bg-primary-50 hover:text-primary-700"
                }`}
            >
              <span>{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}