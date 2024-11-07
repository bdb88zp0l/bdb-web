"use client";
import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";

import { useConfig } from "@/shared/providers/ConfigProvider";
import Modal from "@/shared/modals/Modal";
import AddPaymentModal from "./AddPaymentModal";
import { userPrivateRequest } from "@/config/axios.config";
import { formatAmount, formatDate } from "@/utils/utils";

const ViewBilling = ({
  showModalOpen,
  setShowModalOpen,
  selectedBilling,
  fetchBillings,
  caseInfo,
}: any) => {
  const config = useConfig();
  const [addPaymentModal, setAddPaymentModal] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showModalOpen && selectedBilling?._id) {
      fetchPayments();
    }
  }, [showModalOpen, selectedBilling?._id]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await userPrivateRequest.get(
        `/api/payments/billing/${selectedBilling?._id}`
      );
      setPayments(res.data.data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };


  const getStatusBadgeColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      unpaid: "bg-red-500",
      paid: "bg-green-500",
      partial: "bg-yellow-500",
    };
    return statusColors[status] || "bg-gray-500";
  };

  return (
    <>
      <Modal isOpen={showModalOpen} close={() => setShowModalOpen(false)}>
        <AddPaymentModal
          addPaymentModal={addPaymentModal}
          setAddPaymentModal={setAddPaymentModal}
          fetchPayments={fetchPayments}
          selectedBilling={selectedBilling}
          fetchBillings={fetchBillings}
        />
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center  min-w-[calc(100%-3.5rem)]">
          <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
            <div className="ti-modal-header">
              <h6
                className="modal-title text-[1rem] font-semibold text-defaulttextcolor"
                id="mail-ComposeLabel"
              >
                View Billing
              </h6>
              <button
                type="button"
                className="hs-dropdown-toggle !text-[1rem] !font-semibold !text-defaulttextcolor"
                onClick={() => setShowModalOpen(false)}
              >
                <span className="sr-only">Close</span>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="ti-modal-body px-4 overflow-y-auto">
              <div className="">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                  <h1 className="text-3xl font-bold">
                    {selectedBilling?.title}
                  </h1>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      #{selectedBilling?.billNumber}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <div>
                    <div className="mb-4">
                      <img
                        src={config?.logo || "#"}
                        alt="Logo"
                        className="w-32"
                      />
                    </div>
                    <p className="font-semibold">Bill From:</p>
                    <p>{config?.companyName || "Company Name"}</p>
                    <p>{config?.address || "Company Address"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">Bill To:</p>
                    <p>{selectedBilling?.clientData?.companyName}</p>
                    <p>Client #{selectedBilling?.clientData?.clientNumber}</p>
                  </div>
                  <div className="">
                    <div className="mb-2">
                      <label className="form-label">Date:</label>
                      <p className="text-sm">
                        {formatDate(selectedBilling?.date)}
                      </p>
                    </div>
                    <div>
                      <label className="form-label">Due Date:</label>
                      <p className="text-sm">
                        {formatDate(selectedBilling?.dueDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="form-label">Status:</label>
                  <span
                    className={`${getStatusBadgeColor(
                      selectedBilling?.status
                    )} text-white px-2 py-1 rounded-full text-xs font-semibold uppercase`}
                  >
                    {selectedBilling?.status}
                  </span>
                </div>

                <div className="border border-defaultborder crm-contact py-3 px-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-lg">Payments</h1>
                    <div>
                      <p className="text-sm">
                        Total Paid: ${selectedBilling?.totalPaid}
                      </p>
                      <p className="text-sm">
                        Due Amount: ${selectedBilling?.dueAmount}
                      </p>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table whitespace-nowrap min-w-full">
                      <thead className="border border-defaultborder crm-contact">
                        <tr>
                          <th scope="col" className="text-start">
                            Date
                          </th>
                          <th scope="col" className="text-start">
                            Amount
                          </th>
                          <th scope="col" className="text-start">
                            Payment Type
                          </th>
                          <th scope="col" className="text-start">
                            Description
                          </th>
                          <th scope="col" className="text-start">
                            Receipt
                          </th>
                          <th scope="col" className="text-start">
                            Transaction ID
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={7} className="text-center py-4">
                              Loading payments...
                            </td>
                          </tr>
                        ) : payments.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-4">
                              No payments found
                            </td>
                          </tr>
                        ) : (
                          payments.map((payment: any) => (
                            <tr
                              key={payment._id}
                              className="border border-defaultborder"
                            >
                              <td>{formatDate(payment.date)}</td>
                              <td>{formatAmount(payment.amount)}</td>
                              <td>{payment.paymentMethod}</td>
                              <td>{payment.note}</td>
                              <td>
                                {payment.receipt && (
                                  <a
                                    href={payment.receipt}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    View Receipt
                                  </a>
                                )}
                              </td>
                              <td>{payment.transactionId}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="ti-modal-footer">
                <button
                  onClick={() => setAddPaymentModal(true)}
                  className="ti-btn ti-btn-primary-full py-2 px-4"
                  disabled={selectedBilling?.status === "paid"}
                >
                  Add Payment
                </button>
                <button
                  type="button"
                  className="hs-dropdown-toggle ti-btn ti-btn-light align-middle"
                  onClick={() => setShowModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ViewBilling;
