import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { formatDate } from "@/utils/utils";
import store from "@/shared/redux/store";

interface BillingReceiptProps {
  selectedBilling: any;
  caseInfo: any;
}

const BillingReceipt: React.FC<BillingReceiptProps> = ({
  selectedBilling,
  caseInfo,
}) => {
  const { auth } = store.getState();
  const [workspace, setWorkspace] = useState<any>({});

  useEffect(() => {
    setWorkspace(auth?.user?.defaultWorkspace ?? {});
  }, [auth?.user?.defaultWorkspace]);

  return (
    <div
      id="invoice-content"
      style={{ display: "none", position: "absolute", left: "-9999px" }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex justify-between gap-12 mb-8">
        <div className="flex flex-col space-y-2">
          <h4 className="text-xl font-semibold">{workspace?.name}</h4>
          <p className="text-black">{workspace?.addressLine1}</p>
          <p className="text-black">{workspace?.addressLine2}</p>
          <p className="text-black">VAT Reg. TIN: 010-768-534-00000</p>
        </div>

        <div className="flex flex-col space-y-2 text-right">
          <h4 className="text-xl font-semibold">BILLING INVOICE</h4>
          <p className="text-black">Title: {selectedBilling?.title}</p>
          <p className="text-black">
            Invoice No: #{selectedBilling?.billNumber}
          </p>
          <p className="text-black">
            Date:{" "}
            {selectedBilling?.billingType == "timeBased"
              ? `${formatDate(selectedBilling?.billingStart)} - ${formatDate(
                  selectedBilling?.billingEnd
                )}`
              : formatDate(selectedBilling?.date)}
          </p>
          <p className="text-black">
            Due Date: {formatDate(selectedBilling?.dueDate)}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="border border-black p-4">
          <h4 className="text-lg font-semibold text-black">SOLD TO:</h4>
          <div className="space-y-3 pl-4">
            <p className="text-black">
              Name: {caseInfo?.client?.companyName ?? ""}
            </p>
            <p className="text-black">
              Attention: {caseInfo?.client?.contact?.firstName ?? ""}{" "}
              {caseInfo?.client?.contact?.lastName ?? ""}
            </p>
            <p className="text-black">
              Address: {caseInfo?.client?.addresses?.[0]?.houseNumber ?? ""},{" "}
              {caseInfo?.client?.addresses?.[0]?.street
                ? `${caseInfo?.client?.addresses?.[0]?.street}, `
                : ""}{" "}
              {caseInfo?.client?.addresses?.[0]?.city
                ? `${caseInfo?.client?.addresses?.[0]?.city}, `
                : ""}{" "}
              {caseInfo?.client?.addresses?.[0]?.barangay
                ? `${caseInfo?.client?.addresses?.[0]?.barangay}, `
                : ""}{" "}
              {caseInfo?.client?.addresses?.[0]?.zip
                ? `${caseInfo?.client?.addresses?.[0]?.zip}, `
                : ""}{" "}
              {caseInfo?.client?.addresses?.[0]?.region ?? ""},{" "}
              {caseInfo?.client?.addresses?.[0]?.country ?? ""}
            </p>
            <p className="text-black">TIN: {workspace?.tin ?? ""}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border border-black mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-black">
              <th
                colSpan={3}
                className="p-2 text-center font-bold border-b border-black"
              >
                PARTICULARS
              </th>
            </tr>
          </thead>

          <thead>
            <tr className="border-b border-black">
              <th className="p-2 font-bold text-left border-r border-black">
                DESCRIPTION/NATURE OF SERVICE:
              </th>
              <th className="p-2 font-bold text-center border-r border-black">
                FEE:
              </th>
              <th className="p-2 font-bold text-center">AMOUNT</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-2 align-top border-r border-black"></td>
              <td className="p-2 space-y-2 border-r border-black">
                <div>VATable Sales</div>
                <div>VATable Out of Pocket Expenses (OPEs)</div>
                <div>VAT</div>
                <div>VAT Exempt Sales</div>
                <div>Zero-Rated Sales</div>
                <div>Total Sales (VAT Inclusive)</div>
                <div>Less: VAT</div>
                <div>Amount: Net of VAT</div>
                <div>Less: Discount</div>
                <div>Add: VAT</div>
                <div>Less: Withholding Tax</div>
                <div>Add: Non-VATable OPES</div>
                <div className="font-bold">TOTAL AMOUNT DUE</div>
              </td>
              <td className="p-2 border-l space-y-2 align-top border-black">
                {selectedBilling?.items?.map((item: any, index: number) => (
                  <div key={index} className="py-1">
                    {item.amount ? item.amount.toFixed(2) : "-"}
                  </div>
                ))}

                <div>VATable Sales</div>
                <div>VATable Out of Pocket Expenses (OPEs)</div>
                <div>VAT</div>
                <div>VAT Exempt Sales</div>
                <div>Zero-Rated Sales</div>
                <div>Total Sales (VAT Inclusive)</div>
                <div>Less: VAT</div>
                <div>Amount: Net of VAT</div>
                <div>Less: Discount</div>
                <div>Add: VAT</div>
                <div>Less: Withholding Tax</div>
                <div>Add: Non-VATable OPES</div>
                <div className="font-bold">TOTAL AMOUNT DUE</div>
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr className="border-t border-black">
              <td className="p-2 font-bold border-r border-black flex gap-6">
                <p>QUANTITY:</p>
                <div className="border-l border-black"></div>
                <p> UNIT COST/PRICE:</p>
              </td>
              <td className="p-2 font-bold text-center border-r border-black"></td>
              <td className="p-2" />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="border border-black p-4">
        <p className="text-black mb-4">
          <span className="font-bold">NOTE:</span> Please make all checks
          payable to{" "}
          <span className="font-bold">
            Global Transfer Pricing Resource Center Inc.
          </span>
        </p>

        <p className="text-black mb-4">
          The total amount due is payable within 60 days from the date of this
          invoice. For payment, you may call Dolly L. Tumbokon at 8403-2001 loc.
          200 or you may deposit directly to the following account of{" "}
          <span className="font-bold">Global Pricing Resource Center Inc.</span>
        </p>

        <div className="pl-4 mb-4 space-y-2">
          <p className="text-black">Bank Name:</p>
          <p className="text-black">Savings Account No./Swift Code:</p>
        </div>

        <p className="text-black mb-4">
          Kindly email proof of remittance to Dolly L. Tumbokon at dolly.
          tumbokon@globaltpcenter-manila.com.ph
        </p>

        <div className="flex justify-center items-center mt-8">
          <div className="font-bold text-black">By:</div>
        </div>
      </div>
    </div>
  );
};

export default BillingReceipt;
