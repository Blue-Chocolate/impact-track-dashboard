import { useState, useEffect } from "react";
import { type Setting } from "../types";

interface Props {
  onSubmit: (setting: Omit<Setting, "id"> | Setting) => void;
  initialValues?: Setting;
  onCancel?: () => void;
}

export default function SettingsForm({ onSubmit, initialValues, onCancel }: Props) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (initialValues) {
      setKey(initialValues.key);
      setValue(initialValues.value);
    } else {
      setKey("");
      setValue("");
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !value.trim()) return;

    if (initialValues) onSubmit({ ...initialValues, key, value });
    else onSubmit({ key, value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Key</label>
        <input value={key} onChange={e => setKey(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2" placeholder="Setting key" />
      </div>

      <div>
        <label className="block text-sm font-medium">Value</label>
        <input value={value} onChange={e => setValue(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2" placeholder="Setting value" />
      </div>

      <div className="flex space-x-2">
        <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600">
          {initialValues ? "Update" : "Add"}
        </button>
        {initialValues && onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
