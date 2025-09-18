// src/pages/ProjectsPage.tsx
import { useEffect, useState } from "react";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projectsApi";
import { type Project } from "../types";
import ProjectForm from "../../projects/component/ProjectForm";
import {DashboardLayout} from "../../../components/layout/DashboardLayout";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Project | null>(null);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const handleAdd = async (project: Omit<Project, "id">) => {
    const newProj = await createProject(project);
    setProjects((prev) => [...prev, newProj]);
  };

  const handleEdit = async (project: Project) => {
    const updated = await updateProject(project);
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // search filter
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // pagination logic
  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Projects</h1>

        {/* Search */}
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-64"
          />
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg p-4">
          <ProjectForm
            onSubmit={editing ? handleEdit : handleAdd}
            initialValues={editing || undefined}
            onCancel={() => setEditing(null)}
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg p-4">
          {loading ? (
            <p className="text-gray-500">Loading projects...</p>
          ) : filteredProjects.length === 0 ? (
            <p className="text-gray-500">No projects found.</p>
          ) : (
            <>
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProjects.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button
                          onClick={() => setEditing(p)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
