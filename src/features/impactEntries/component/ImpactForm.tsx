import { useState } from "react";
import {type ImpactEntry } from "../types";

export default function ImpactForm({ onSubmit }: { onSubmit: (data: Omit<ImpactEntry, "id">) => void }) {
  const [form, setForm] = useState<Omit<ImpactEntry, "id">>({
    projectId: 0,
    beneficiaryName: "",
    date: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <input name="projectId" type="number" placeholder="Project ID" value={form.projectId} onChange={handleChange} className="input" />
      <input name="beneficiaryName" placeholder="Beneficiary Name" value={form.beneficiaryName} onChange={handleChange} className="input" />
      <input type="date" name="date" value={form.date} onChange={handleChange} className="input" />
      <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} className="textarea" />
      <button type="submit" className="btn-primary w-full">Save</button>
    </form>
  );
}
