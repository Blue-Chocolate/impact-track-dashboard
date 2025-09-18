import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../../../store/store";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import DonorForm from "../components/DonorForm";
import { loadDonors, addDonor, editDonor, removeDonor } from "../donorsSlice";
import {type Donor } from "../types";

export default function DonorsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { donors, loading } = useSelector((state: RootState) => state.donors);
  const [editing, setEditing] = useState<Donor | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => { dispatch(loadDonors()); }, [dispatch]);

  const filtered = donors.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Donors & Sponsors</h1>
        <input type="text" placeholder="Search donors..." value={search} onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64" />

        <div className="bg-white shadow rounded-lg p-4">
          <DonorForm
            onSubmit={(d) => editing ? dispatch(editDonor(d as Donor)) : dispatch(addDonor(d as Omit<Donor, "id">))}
            initialValues={editing || undefined}
            onCancel={() => setEditing(null)}
          />
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          {loading ? <p>Loading...</p> : filtered.length === 0 ? <p>No donors found.</p> :
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id} className="border-t">
                    <td className="px-4 py-2">{d.name}</td>
                    <td className="px-4 py-2">{d.email}</td>
                    <td className="px-4 py-2">${d.amount}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button className="text-blue-500" onClick={() => setEditing(d)}>Edit</button>
                      <button className="text-red-500" onClick={() => dispatch(removeDonor(d.id))}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>}
        </div>
      </div>
    </DashboardLayout>
  );
}
