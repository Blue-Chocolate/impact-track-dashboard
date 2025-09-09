// components/Sidebar.tsx
import { Link } from "react-router-dom";

export default function Sidebar({ open, setOpen }: any) {
  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Impact Entries", path: "/impact-entries" },
    { label: "Create New Entry", path: "/create-entry" },
    { label: "Reports", path: "/reports" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <div className={`bg-white shadow-md h-full fixed md:relative z-20 transition-transform ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-64`}>
      <div className="p-6 text-xl font-bold border-b">Impact Tracker</div>
      <ul className="mt-4 space-y-2">
        {menuItems.map((item, idx) => (
          <li key={idx}>
            <Link to={item.path} className="block px-4 py-2 rounded hover:bg-gray-200">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
