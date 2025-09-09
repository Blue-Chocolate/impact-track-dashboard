// pages/ImpactEntries.tsx
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "../components/Modal.tsx";

export default function ImpactEntries() {
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["impact-entries"],
    queryFn: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      return res.json();
    },
  });

  const filtered = data?.filter((d: any) => d.title.includes(search) || d.body.includes(search)) || [];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Impact Entries</h2>
      <input
        type="text"
        placeholder="Search entries..."
        className="mb-4 border px-3 py-2 rounded w-full md:w-1/2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.slice(0, 10).map((entry: any) => (
            <tr key={entry.id} className="hover:bg-gray-100 cursor-pointer">
              <td className="border px-4 py-2">{entry.id}</td>
              <td className="border px-4 py-2">{entry.title}</td>
              <td className="border px-4 py-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setSelectedEntry(entry)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEntry && (
        <Modal onClose={() => setSelectedEntry(null)} title="Impact Entry Details">
          <h3 className="font-bold mb-2">{selectedEntry.title}</h3>
          <p>{selectedEntry.body}</p>
        </Modal>
      )}
    </div>
  );
}
