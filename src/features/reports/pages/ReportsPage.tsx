import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { loadReports, setSearchTerm, type Report } from "../reportsSlice";
import useExportPdf from "../hooks/useExportPdf";
import type { RootState, AppDispatch } from "../../../store/store";

const COLORS = ["#3b82f6", "#2563eb", "#1e40af"];

export default function ReportsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, searchTerm } = useSelector((state: RootState) => state.reports);
  const { exportPdf } = useExportPdf();

  useEffect(() => {
    dispatch(loadReports());
  }, [dispatch]);

  // Filter reports by title or summary
  const filteredReports = items.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dynamic numbers for cards
  const totalReports = filteredReports.length;
  const totalBeneficiaries = filteredReports.reduce((sum, r) => {
    const match = r.summary.match(/(\d+)/);
    return match ? sum + parseInt(match[0]) : sum;
  }, 0);

  const chartData = [
    { name: "Reports", value: totalReports },
    { name: "Beneficiaries", value: totalBeneficiaries },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Reports</h1>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search reports by title or summary..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="border p-2 flex-1 rounded"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold">Total Reports</h2>
            <p className="text-3xl font-bold text-blue-600">{totalReports}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold">Total Beneficiaries</h2>
            <p className="text-3xl font-bold text-blue-600">{totalBeneficiaries}</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow rounded-lg p-4 h-80">
          <h2 className="text-lg font-semibold mb-4">Distribution</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#3b82f6"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Reports List */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Reports List</h2>
          {loading ? (
            <p className="text-gray-500">Loading reports...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul className="divide-y">
              {filteredReports.map((r) => (
                <li key={r.id} className="py-4">
                  <div id={`report-${r.id}`} className="space-y-1">
                    <div className="font-medium text-lg">{r.title}</div>
                    <div className="text-sm text-gray-500">{r.date}</div>
                    <p>{r.summary}</p>
                  </div>
                  <button
                    onClick={() =>
                      exportPdf(`report-${r.id}`, r.title.replace(/\s+/g, "_"))
                    }
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Download PDF
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
