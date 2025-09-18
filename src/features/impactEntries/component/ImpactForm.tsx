// src/features/impactEntries/components/ImpactEntryForm.tsx
import { useState, useEffect } from "react";
import { type ImpactEntry } from "../types";

interface Props {
  onSubmit: (entry: Omit<ImpactEntry, "id"> | ImpactEntry) => void;
  initialValues?: ImpactEntry;
  onCancel?: () => void;
}

export default function ImpactEntryForm({
  onSubmit,
  initialValues,
  onCancel,
}: Props) {
  const [title, setTitle] = useState("");
  const [beneficiaries, setBeneficiaries] = useState(0);

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title);
      setBeneficiaries(initialValues.beneficiaries);
    } else {
      setTitle("");
      setBeneficiaries(0);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || beneficiaries <= 0) return;

    if (initialValues) {
      onSubmit({ ...initialValues, title, beneficiaries });
    } else {
      onSubmit({ title, beneficiaries });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Entry title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Beneficiaries</label>
        <input
          type="number"
          value={beneficiaries}
          onChange={(e) => setBeneficiaries(Number(e.target.value))}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Number of beneficiaries"
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          {initialValues ? "Update" : "Add"}
        </button>
        {initialValues && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
