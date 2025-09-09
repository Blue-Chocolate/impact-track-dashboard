// pages/EntryForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type Entry = {
  id: number;
  title: string;
  description: string;
  status: "Active" | "Completed";
  metrics: number;
  date: string;
};

export default function EntryForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if editing: pass state via navigate
  const editingEntry: Entry | null = (location.state as any)?.entry || null;

  const [form, setForm] = useState<Entry>({
    id: editingEntry?.id || Date.now(),
    title: editingEntry?.title || "",
    description: editingEntry?.description || "",
    status: editingEntry?.status || "Active",
    metrics: editingEntry?.metrics || 0,
    date: editingEntry?.date || new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "metrics" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fetch current entries
    const res = await fetch("/data/impact-entries.json");
    const entries: Entry[] = await res.json();

    let updatedEntries: Entry[];
    if (editingEntry) {
      // Edit existing
      updatedEntries = entries.map((en) => (en.id === form.id ? form : en));
    } else {
      // Create new
      updatedEntries = [...entries, form];
    }

    // For now, we cannot write to JSON file in public folder.
    // Instead, we mock saving and navigate back
    console.log("Saved entries:", updatedEntries);
    alert("Entry saved! (Check console for updated JSON array)");
    navigate("/impact-entries");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">{editingEntry ? "Edit Entry" : "Create New Entry"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Metrics (People Impacted)</label>
          <input
            name="metrics"
            type="number"
            value={form.metrics}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Entry
        </button>
      </form>
    </div>
  );
}
