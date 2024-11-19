// "use client";
// import React, { useEffect, useState } from "react";

// import dynamic from "next/dynamic";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { formatDate } from "@/utils/utils";
// import { useConfig } from "@/shared/providers/ConfigProvider";
// import Modal from "@/shared/modals/Modal";
// import { userPrivateRequest } from "@/config/axios.config";
// import ViewBilling from "./ViewBilling";

// const BillingPdf = ({
//   setDownloadModalOpen,
//   downloadModalOpen,
//   selectedBilling,
// }: any) => {
//   const config = useConfig();

//   const downloadPDF = () => {
//     const invoiceContent = document.getElementById("invoice-content");
//     console.log(downloadPDF, "downloadPDF");

//     if (invoiceContent) {
//       html2canvas(invoiceContent).then((canvas) => {
//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");

//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const pageHeight = pdf.internal.pageSize.getHeight();

//         const scale = Math.min(
//           (pageWidth - 20) / (canvas.width * 0.26458333),
//           pageHeight / (canvas.height * 0.26458333)
//         );

//         const imgWidth = canvas.width * 0.26458333 * scale;
//         const imgHeight = canvas.height * 0.26458333 * scale;

//         const xOffset = (pageWidth - imgWidth) / 2;
//         const yOffset = 10;

//         pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);

//         pdf.save("invoice.pdf");
//         setDownloadModalOpen(false);
//       });
//     }
//   };

//   return (
//     <>
//       <Modal
//         isOpen={downloadModalOpen}
//         close={() => setDownloadModalOpen(false)}
//       >
//         <ViewBilling downloadPDF={downloadPDF} />
//         <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center min-w-[60%] w-[60%]">
//           <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
//             <div className="ti-modal-header">
//               <h6
//                 className="modal-title text-[1rem] font-semibold text-defaulttextcolor"
//                 id="mail-ComposeLabel"
//               >
//                 Billing Pdf
//               </h6>
//               <button
//                 type="button"
//                 className="hs-dropdown-toggle !text-[1rem] !font-semibold !text-defaulttextcolor"
//                 onClick={() => setDownloadModalOpen(false)}
//               >
//                 <span className="sr-only">Close</span>
//                 <i className="ri-close-line"></i>
//               </button>
//             </div>
//             <div className="ti-modal-body overflow-y-auto border border-defaultborder crm-contact py-3 px-4">
//               <div className="max-w-4xl mx-auto" id="invoice-content">
//                 <div className="flex justify-between gap-12 mb-8">
//                   <div className="flex flex-col space-y-2">
//                     <h4 className="text-xl font-semibold">
//                       GLOBAL TRANSFER PRICING RESOURCE CENTER INC
//                     </h4>
//                     <p className="text-black">
//                       20th Floor Chatham House V.A. Rufino cor. Valero St.,
//                     </p>
//                     <p className="text-black">
//                       Salcedo Village Bel-Air, 1209 City of Makati
//                     </p>
//                     <p className="text-black">
//                       NCR Fourth District Philippines
//                     </p>
//                     <p className="text-black">
//                       VAT Reg. TIN: 010-768-534-00000
//                     </p>
//                   </div>

//                   <div className="flex flex-col space-y-2 text-right">
//                     <h4 className="text-xl font-semibold">BILLING INVOICE</h4>
//                     <p className="text-black">
//                       Invoice No: {selectedBilling?.title}
//                     </p>
//                     <p className="text-black">
//                       Date: {formatDate(selectedBilling?.billingStart)}
//                     </p>
//                     <p className="text-black">
//                       Our Ref: {formatDate(selectedBilling?.dueDate)}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mb-8">
//                   <div className="border border-black p-4">
//                     <h4 className="text-lg font-semibold text-black">
//                       SOLD TO:
//                     </h4>
//                     <div className="space-y-3 pl-4">
//                       <p className="text-black">
//                         Name: {selectedBilling?.title}
//                       </p>
//                       <p className="text-black">Attention:</p>
//                       <p className="text-black">Address:</p>
//                       <p className="text-black">TIN:</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="overflow-x-auto border border-black mb-6">
//                   <table className="w-full border-collapse">
//                     <thead>
//                       <tr className="border-b border-black">
//                         <th
//                           colSpan={3}
//                           className="p-2 text-center font-bold border-b border-black"
//                         >
//                           PARTICULARS
//                         </th>
//                       </tr>
//                     </thead>

//                     <thead>
//                       <tr className="border-b border-black">
//                         <th className="p-2 font-bold text-left border-r border-black">
//                           DESCRIPTION/NATURE OF SERVICE:
//                         </th>
//                         <th className="p-2 font-bold text-center border-r border-black">
//                           FEE:
//                         </th>
//                         <th className="p-2 font-bold text-center">AMOUNT</th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       <tr>
//                         <td className="p-2 align-top border-r border-black"></td>
//                         <td className="p-2 space-y-2 border-r border-black">
//                           <div>VATable Sales</div>
//                           <div>VATable Out of Pocket Expenses (OPEs)</div>
//                           <div>VAT</div>
//                           <div>VAT Exempt Sales</div>
//                           <div>Zero-Rated Sales</div>
//                           <div>Total Sales (VAT Inclusive)</div>
//                           <div>Less: VAT</div>
//                           <div>Amount: Net of VAT</div>
//                           <div>Less: Discount</div>
//                           <div>Add: VAT</div>
//                           <div>Less: Withholding Tax</div>
//                           <div>Add: Non-VATable OPES</div>
//                           <div className="font-bold">TOTAL AMOUNT DUE</div>
//                         </td>
//                         <td className="p-2 border-l space-y-2 align-top border-black">
//                           {selectedBilling?.items?.map(
//                             (item: any, index: number) => (
//                               <div key={index} className="py-1">
//                                 {item.amount ? item.amount.toFixed(2) : "-"}
//                               </div>
//                             )
//                           )}

//                           <div>VATable Sales</div>
//                           <div>VATable Out of Pocket Expenses (OPEs)</div>
//                           <div>VAT</div>
//                           <div>VAT Exempt Sales</div>
//                           <div>Zero-Rated Sales</div>
//                           <div>Total Sales (VAT Inclusive)</div>
//                           <div>Less: VAT</div>
//                           <div>Amount: Net of VAT</div>
//                           <div>Less: Discount</div>
//                           <div>Add: VAT</div>
//                           <div>Less: Withholding Tax</div>
//                           <div>Add: Non-VATable OPES</div>
//                           <div className="font-bold">TOTAL AMOUNT DUE</div>
//                         </td>
//                       </tr>
//                     </tbody>

//                     <tfoot>
//                       <tr className="border-t border-black">
//                         <td className="p-2 font-bold border-r border-black flex gap-6">
//                           <p>QUANTITY:</p>
//                           <div className="border-l border-black"></div>
//                           <p> UNIT COST/PRICE:</p>
//                         </td>
//                         <td className="p-2 font-bold text-center border-r border-black"></td>
//                         <td className="p-2" />
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>

//                 <div className="border border-black p-4">
//                   <p className="text-black mb-4">
//                     <span className="font-bold">NOTE:</span> Please make all
//                     checks payable to{" "}
//                     <span className="font-bold">
//                       Global Transfer Pricing Resource Center Inc.
//                     </span>
//                   </p>

//                   <p className="text-black mb-4">
//                     The total amount due is payable within 60 days from the date
//                     of this invoice. For payment, you may call Dolly L. Tumbokon
//                     at 8403-2001 loc. 200 or you may deposit directly to the
//                     following account of{" "}
//                     <span className="font-bold">
//                       Global Pricing Resource Center Inc.
//                     </span>
//                   </p>

//                   <div className="pl-4 mb-4 space-y-2">
//                     <p className="text-black">Bank Name:</p>
//                     <p className="text-black">
//                       Savings Account No./Swift Code:
//                     </p>
//                   </div>

//                   <p className="text-black mb-4">
//                     Kindly email proof of remittance to Dolly L. Tumbokon at{" "}
//                     dolly. tumbokon@globaltpcenter-manila.com.ph
//                   </p>

//                   <div className="flex justify-center items-center mt-8">
//                     <div className="font-bold text-black">By:</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="ti-modal-footer">
//               <button
//                 onClick={downloadPDF}
//                 className="ti-btn ti-btn-primary-full py-2 px-4"
//               >
//                 Download
//               </button>
//               <button
//                 type="button"
//                 className="hs-dropdown-toggle ti-btn ti-btn-light align-middle"
//                 onClick={() => setDownloadModalOpen(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default BillingPdf;
