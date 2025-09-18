// src/features/impactEntries/pages/ImpactEntriesPage.tsx
import { useEffect, useState } from "react";
import {DashboardLayout} from "../../../components/layout/DashboardLayout";
import { type  ImpactEntry } from "../types";
import {
  fetchImpactEntries,
  createImpactEntry,
  updateImpactEntry,
  deleteImpactEntry,
} from "../api/impactApi";
import ImpactEntryForm from "../component/ImpactForm";

export default function ImpactEntriesPage() {
  const [entries, setEntries] = useState<ImpactEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ImpactEntry | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchImpactEntries().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const handleAdd = async (entry: Omit<ImpactEntry, "id">) => {
    const newEntry = await createImpactEntry(entry);
    setEntries((prev) => [...prev, newEntry]);
  };

  const handleEdit = async (entry: ImpactEntry) => {
    const updated = await updateImpactEntry(entry);
    setEntries((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    await deleteImpactEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const filtered = entries.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Impact Entries</h1>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />

        <div className="bg-white shadow rounded-lg p-4">
          <ImpactEntryForm
            onSubmit={(entry) => {
              if (editing) {
                // entry is ImpactEntry
                void handleEdit(entry as ImpactEntry);
              } else {
                // entry is Omit<ImpactEntry, "id">
                void handleAdd(entry as Omit<ImpactEntry, "id">);
              }
            }}
            initialValues={editing || undefined}
            onCancel={() => setEditing(null)}
          />
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          {loading ? (
            <p>Loading...</p>
          ) : paginated.length === 0 ? (
            <p>No entries found.</p>
          ) : (
            <>
              <table className="min-w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Beneficiaries</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((e) => (
                    <tr key={e.id} className="border-t">
                      <td className="px-4 py-2">{e.title}</td>
                      <td className="px-4 py-2">{e.beneficiaries}</td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button
                          onClick={() => setEditing(e)}
                          className="text-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between mt-4">
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