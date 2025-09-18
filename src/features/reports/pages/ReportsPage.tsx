import ImpactCharts from "../components/ImpactCharts";
import useExportPdf from "../hooks/useExportPdf";

const dummyData = [
  { date: "2025-01", beneficiaries: 20 },
  { date: "2025-02", beneficiaries: 50 },
  { date: "2025-03", beneficiaries: 80 },
];

export default function ReportsPage() {
  const { exportPdf } = useExportPdf();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <div id="report-content">
        <ImpactCharts data={dummyData} />
      </div>

      <button
        onClick={() => exportPdf("report-content", "ImpactReport")}
        className="btn-primary"
      >
        Export PDF
      </button>
    </div>
  );
}
