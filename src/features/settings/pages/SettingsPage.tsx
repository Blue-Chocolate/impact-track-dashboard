import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../../../store/store";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import SettingsForm from "../components/SettingsForm";
import { loadSettings, addSetting, editSetting, removeSetting } from "../settingsSlice";
import { type Setting } from "../types";

export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading } = useSelector((state: RootState) => state.settings);
  const [editing, setEditing] = useState<Setting | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => { dispatch(loadSettings()); }, [dispatch]);

  const filtered = settings.filter(s => s.key.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <input type="text" placeholder="Search settings..." value={search} onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64" />

        <div className="bg-white shadow rounded-lg p-4">
          <SettingsForm
            onSubmit={(s) => editing ? dispatch(editSetting(s as Setting)) : dispatch(addSetting(s as Omit<Setting, "id">))}
            initialValues={editing || undefined}
            onCancel={() => setEditing(null)}
          />
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          {loading ? <p>Loading...</p> : filtered.length === 0 ? <p>No settings found.</p> :
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Key</th>
                  <th className="px-4 py-2 text-left">Value</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-2">{s.key}</td>
                    <td className="px-4 py-2">{s.value}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button className="text-blue-500" onClick={() => setEditing(s)}>Edit</button>
                      <button className="text-red-500" onClick={() => dispatch(removeSetting(s.id))}>Delete</button>
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
