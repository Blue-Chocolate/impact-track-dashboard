import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 h-screen p-4">
      <nav className="space-y-4">
        <Link to="/projects">Projects</Link>
        <Link to="/impacts">Impacts</Link>
        <Link to="/reports">Reports</Link>
      </nav>
    </aside>
  );
}
