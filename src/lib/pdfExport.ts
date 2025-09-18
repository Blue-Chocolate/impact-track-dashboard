// pdfExport.ts
// Helper to capture DOM element and export to PDF using html2canvas + jsPDF

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Capture a DOM element and create a PDF.
 * - element: HTMLElement to capture
 * - fileName: desired output name (e.g. "impact-report.pdf")
 * - options: optional html2canvas options (scale, useCORS, backgroundColor, etc.)
 */
export async function exportElementToPdf(
  element: HTMLElement,
  fileName = "report.pdf",
  options?: Partial<html2canvas.Options>
) {
  if (!element) throw new Error("No element provided for PDF export");

  // default options
  const defaultOpts: html2canvas.Options = {
    scale: 2, // increase resolution (retina)
    useCORS: true, // try to load cross-origin images if any
    allowTaint: false,
    backgroundColor: "#ffffff",
    ...(options || {}),
  };

  // capture element to canvas
  const canvas = await html2canvas(element, defaultOpts);

  // canvas to image data
  const imgData = canvas.toDataURL("image/png");

  // jsPDF uses units 'pt','mm','cm','in'. We'll use 'mm'
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // calculate image dimensions in PDF units
  const pdfPageWidth = pdf.internal.pageSize.getWidth();
  const pdfPageHeight = pdf.internal.pageSize.getHeight();

  // image width/height in px
  const imgWidthPx = canvas.width;
  const imgHeightPx = canvas.height;

  // convert px to mm roughly: 1 px = 0.264583 mm (at 96 DPI)
  const pxToMm = (px: number) => (px * 0.2645833333);

  const imgWidthMm = pxToMm(imgWidthPx);
  const imgHeightMm = pxToMm(imgHeightPx);

  // scale to fit width with margin
  const margin = 10; // mm
  const maxPdfWidth = pdfPageWidth - margin * 2;
  const scale = Math.min(1, maxPdfWidth / imgWidthMm);

  const finalImgWidth = imgWidthMm * scale;
  const finalImgHeight = imgHeightMm * scale;

  const x = (pdfPageWidth - finalImgWidth) / 2;
  let y = margin;

  // If image height is larger than remaining page height, we will split across pages.
  // We'll draw the image on canvas segments (by drawing the full image scaled to width,
  // then slicing vertical chunks and adding them page by page).
  // A simpler approach is to fit the whole captured image on one page (scaled), which usually works.
  // We'll try the single-page fit first and fallback to multi-page tiling if needed.

  if (finalImgHeight <= pdfPageHeight - margin * 2) {
    // fits on one page
    pdf.addImage(imgData, "PNG", x, y, finalImgWidth, finalImgHeight);
  } else {
    // multi-page: slice the canvas vertically into page-sized chunks.
    // create an offscreen canvas at the scaled width
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = Math.round(finalImgWidth / (pxToMm(1))); // convert mm back to px approx (not exact)
    // To avoid complexity with DPI conversions, we'll use canvas width equal to original canvas width scaled,
    // then draw portions of the original canvas.
    // Simpler approach: compute ratio and compute pixel height per PDF page.
    const ratio = finalImgWidth / imgWidthMm; // mm->mm ratio (should be <=1)
    // pixel-per-mm to compute slice height in px
    const pxPerMm = imgHeightPx / imgHeightMm;
    const pageHeightMm = pdfPageHeight - margin * 2;
    const pageHeightPx = Math.round(pageHeightMm * pxPerMm);

    let remainingHeightPx = imgHeightPx;
    let offsetY = 0;

    while (remainingHeightPx > 0) {
      const sliceHeight = Math.min(pageHeightPx, remainingHeightPx);

      // create a canvas for this slice
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = imgWidthPx;
      sliceCanvas.height = sliceHeight;

      const ctx = sliceCanvas.getContext("2d");
      if (!ctx) break;

      // draw slice from original canvas
      ctx.drawImage(
        canvas,
        0,
        offsetY,
        imgWidthPx,
        sliceHeight,
        0,
        0,
        imgWidthPx,
        sliceHeight
      );

      const sliceData = sliceCanvas.toDataURL("image/png");

      // compute slice size in mm
      const sliceHeightMm = pxToMm(sliceHeight) * scale;

      // add slice to PDF
      pdf.addImage(sliceData, "PNG", x, y, finalImgWidth, sliceHeightMm);
      remainingHeightPx -= sliceHeight;
      offsetY += sliceHeight;

      if (remainingHeightPx > 0) {
        pdf.addPage();
        y = margin;
      }
    }
  }

  // Save file
  pdf.save(fileName);
}
