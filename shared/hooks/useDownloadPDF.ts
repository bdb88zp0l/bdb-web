import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DownloadPDFOptions {
  filename?: string;
  quality?: number;
}

export const useDownloadPDF = () => {
  const downloadPDF = async (billing: any, options: DownloadPDFOptions = {}) => {
    const {
      filename = `invoice-${billing.billNumber}.pdf`,
      quality = 1
    } = options;

    const invoiceContent = document.getElementById("invoice-content");
    if (!invoiceContent) {
      console.error("Invoice content element not found");
      return;
    }

    try {
      let scale = 2;
      let quality = 1;
      const canvas = await html2canvas(invoiceContent, {
        scale,
        logging: false,
        onclone: (document) => {
          const element = document.getElementById("invoice-content");
          if (element) {
            element.style.display = "block";
          }
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // const scale = Math.min(
      //   (pageWidth - 20) / (canvas.width * 0.26458333),
      //   pageHeight / (canvas.height * 0.26458333)
      // );

      const imgWidth = canvas.width * 0.26458333 * scale;
      const imgHeight = canvas.height * 0.26458333 * scale;

      const xOffset = (pageWidth - imgWidth) / 2;
      const yOffset = 10;

      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return { downloadPDF };
}; 