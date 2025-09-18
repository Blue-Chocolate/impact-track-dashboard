import { jsPDF } from "jspdf";

export default function useExportPdf() {
  const exportPdf = (contentId: string, fileName: string) => {
    const input = document.getElementById(contentId);
    if (!input) return;

    const pdf = new jsPDF("p", "pt", "a4");
    pdf.html(input, {
      callback: () => pdf.save(`${fileName}.pdf`),
    });
  };

  return { exportPdf };
}
