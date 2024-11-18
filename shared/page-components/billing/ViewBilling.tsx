"use client";
import { useEffect, useState } from "react";

import { userPrivateRequest } from "@/config/axios.config";
import Modal from "@/shared/modals/Modal";
import { useConfig } from "@/shared/providers/ConfigProvider";
import store from "@/shared/redux/store";
import { formatAmount, formatDate } from "@/utils/utils";
import AddPaymentModal from "./AddPaymentModal";

const ViewBilling = ({
  showModalOpen,
  setShowModalOpen,
  selectedBilling,
  fetchBillings,
  caseInfo,
  downloadPDF,
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
      overPaid: "bg-green-900",
      partiallyPaid: "bg-yellow-500",
    };
    return statusColors[status] || "bg-gray-500";
  };

  const { auth } = store.getState();
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
            <div className="ti-modal-body overflow-y-auto border border-defaultborder crm-contact py-3 px-4">
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

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <label className="mb-2 font-bold text-[16px]">
                      Bill From:
                    </label>
                    <div className="col-span-12 grid grid-cols-2 gap-x-4">
                      <label className="mb-2 font-bold">Name:</label>
                      <span>{auth?.user?.defaultWorkspace?.name ?? ""}</span>

                      <label className="mb-2 font-bold">Phone Number:</label>
                      <span>{auth?.user?.defaultWorkspace?.phone ?? ""}</span>

                      <label className="mb-2 font-bold">Email:</label>
                      <span>{auth?.user?.defaultWorkspace?.email ?? ""}</span>

                      <label className="mb-2 font-bold">Address:</label>
                      <span>
                        {auth?.user?.defaultWorkspace?.addressLine1 ?? ""}
                        <br />
                        {auth?.user?.defaultWorkspace?.addressLine2 ?? ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <label className="mb-2 font-bold text-[16px]">
                      Bill To:
                    </label>
                    <div className="col-span-12 grid grid-cols-2 gap-x-4">
                      <label className="mb-2 font-bold">Name:</label>
                      <span>{caseInfo?.client?.companyName ?? ""}</span>

                      <label className="mb-2 font-bold">Phone Number:</label>
                      <span>
                        {caseInfo?.client?.phones?.map((item) => {
                          return (
                            <>
                              <span>
                                {item?.dialCode} {item?.phoneNumber}
                              </span>
                              <br />
                            </>
                          );
                        })}
                      </span>

                      <label className="mb-2 font-bold">Email:</label>
                      <span>
                        {caseInfo?.client?.emails?.map((item) => {
                          return (
                            <>
                              <span>{item?.value}</span>
                              <br />
                            </>
                          );
                        })}
                      </span>

                      <label className="mb-2 font-bold">Address:</label>
                      <span>
                        {caseInfo?.client?.addresses?.map((address) => {
                          return (
                            <div key={address?._id}>
                              {`${address.houseNumber || "N/A"}, ${
                                address.street || "N/A"
                              }, ${address.city || "N/A"}, ${
                                address.barangay || "N/A"
                              }, ${address.zip || "N/A"}, ${
                                address.region || "N/A"
                              }, ${address.country || "N/A"}`}{" "}
                              <span className="badge bg-light text-[#8c9097] dark:text-white/50 m-1">
                                {address?.label}
                              </span>{" "}
                            </div>
                          );
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <label className="mb-2 font-bold text-[16px]">
                      Summary:
                    </label>
                    <div className="col-span-12 grid grid-cols-2 gap-x-4">
                      <label className="mb-2 font-bold">Billing Type:</label>
                      <span>{selectedBilling?.billingType}</span>
                      <label className="mb-2 font-bold">Billing Date:</label>
                      <span>
                        {formatDate(selectedBilling?.billingStart)}

                        {selectedBilling?.billingType == "timeBased" && (
                          <span>
                            {" "}
                            - {formatDate(selectedBilling?.billingEnd)}{" "}
                          </span>
                        )}
                      </span>
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
                <div className="summary-section">
                  <h1 className="text-lg mt-5 mb-4">Items</h1>
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full table-auto border border-defaultborder crm-contact">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 text-left font-bold">#</th>
                          <th className="p-3 text-left font-bold">
                            Particulars
                          </th>
                          <th className="p-3 text-left font-bold">Numbers</th>
                          <th className="p-3 text-left font-bold">
                            Rate/Unit Cost (USD)
                          </th>
                          <th className="p-3 text-left font-bold">Discount</th>
                          <th className="p-3 text-left font-bold">Tax</th>
                          <th className="p-3 text-left font-bold">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBilling?.items &&
                        selectedBilling.items.length > 0 ? (
                          selectedBilling.items.map((billing, index) => (
                            <tr className="border-b" key={billing._id}>
                              <td className="p-3">{index + 1}</td>
                              <td className="p-3">{billing.particulars}</td>
                              <td className="p-3">{billing.quantity}</td>
                              <td className="p-3">{billing.price}</td>
                              <td className="p-3">{billing.discount}</td>
                              <td className="p-3">{billing.vat}</td>
                              <td className="p-3">{billing.amount}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td col-Span="6" className="p-3 text-center">
                              No data available
                            </td>
                          </tr>
                        )}

                        <tr className="border-b">
                          <td colSpan={5}></td>
                          <td className="p-3 font-bold">Sub Total</td>
                          <td className="p-3">{selectedBilling?.subTotal}</td>
                        </tr>
                        <tr className="border-b">
                          <td colSpan={5}></td>
                          <td className="p-3 font-bold">Total Tax</td>
                          <td className="p-3">
                            {selectedBilling?.tax.toFixed(2)}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td colSpan={5}></td>
                          <td className="p-3 font-bold">Total Discount</td>
                          <td className="p-3">
                            {selectedBilling?.discount.toFixed(2)}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td colSpan={5}></td>
                          <td className="p-3 font-bold">Total Amount</td>
                          <td className="p-3">
                            {selectedBilling?.grandTotal.toFixed(2)}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td colSpan={5}></td>
                          <td className="p-3 font-bold">Due Amount</td>
                          <td className="p-3">
                            {selectedBilling?.dueAmount.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-lg">Payments</h1>
                    {/* <div>
                      <p className="text-sm">
                        Total Paid: ${selectedBilling?.totalPaid}
                      </p>
                      <p className="text-sm">
                        Due Amount: ${selectedBilling?.dueAmount}
                      </p>
                    </div> */}
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
            </div>
            <div className="ti-modal-footer">
              {/* <button
                onClick={() => {
                  downloadPDF;
                }}
                className="ti-btn ti-btn-primary-full py-2 px-4"
              >
                Download
              </button> */}

              {selectedBilling?.status !== "paid" && (
                <button
                  onClick={() => setAddPaymentModal(true)}
                  className="ti-btn ti-btn-primary-full py-2 px-4"
                  // disabled={selectedBilling?.status === "paid"}
                >
                  Add Payment
                </button>
              )}
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
      </Modal>
    </>
  );
};

export default ViewBilling;
