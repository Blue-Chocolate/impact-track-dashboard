// src/components/ProjectForm.tsx
import { useState, useEffect } from "react";
import { type Project } from "../types";

interface ProjectFormProps {
  onSubmit: (project: Omit<Project, "id"> | Project) => void;
  initialValues?: Project;
  onCancel?: () => void;
}

export default function ProjectForm({
  onSubmit,
  initialValues,
  onCancel,
}: ProjectFormProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
    } else {
      setName("");
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (initialValues) {
      onSubmit({ ...initialValues, name });
    } else {
      onSubmit({ name });
    }
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Project Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Enter project name"
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
