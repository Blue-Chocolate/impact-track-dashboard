import { useEffect, useState } from "react";
import { fetchImpacts, createImpact, deleteImpact } from "../api/impactApi";
import { type ImpactEntry } from "../types";
import ImpactForm from "../../impactEntries/component/ImpactForm";

export default function ImpactEntriesPage() {
  const [impacts, setImpacts] = useState<ImpactEntry[]>([]);

  useEffect(() => {
    fetchImpacts().then(setImpacts);
  }, []);

  const handleAdd = async (entry: Omit<ImpactEntry, "id">) => {
    const newEntry = await createImpact(entry);
    setImpacts((prev) => [...prev, newEntry]);
  };

  const handleDelete = async (id: number) => {
    await deleteImpact(id);
    setImpacts((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Impact Entries</h1>
      <ImpactForm onSubmit={handleAdd} />

      <ul className="divide-y">
        {impacts.map((i) => (
          <li key={i.id} className="flex justify-between py-2">
            <span>{i.beneficiaryName}</span>
            <button onClick={() => handleDelete(i.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
