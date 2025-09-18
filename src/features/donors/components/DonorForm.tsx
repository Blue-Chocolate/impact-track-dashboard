import { useState, useEffect } from "react";
import { type Donor } from "../types";

interface Props {
  onSubmit: (donor: Omit<Donor, "id"> | Donor) => void;
  initialValues?: Donor;
  onCancel?: () => void;
}

export default function DonorForm({ onSubmit, initialValues, onCancel }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setEmail(initialValues.email);
      setAmount(initialValues.amount);
    } else {
      setName("");
      setEmail("");
      setAmount(0);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || amount <= 0) return;

    if (initialValues) {
      onSubmit({ ...initialValues, name, email, amount });
    } else {
      onSubmit({ name, email, amount });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input value={name} onChange={e => setName(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Donor name" />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Email address" />
      </div>

      <div>
        <label className="block text-sm font-medium">Amount Donated</label>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Amount donated" />
      </div>

      <div className="flex space-x-2">
        <button type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600">
          {initialValues ? "Update" : "Add"}
        </button>
        {initialValues && onCancel && (
          <button type="button" onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
