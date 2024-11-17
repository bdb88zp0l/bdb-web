"use client";
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import moment from "moment";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

const Select = dynamic(() => import("react-select"), { ssr: false });

const AddPaymentModal = ({
  selectedBilling,
  fetchPayments,
  addPaymentModal,
  setAddPaymentModal,
  fetchBillings,
}: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>({
    billingId: selectedBilling?._id,
    amount: selectedBilling?.dueAmount || 0,
    date: new Date(),
    paymentMethod: "",
    note: "",
  });

  const paymentMethods = [
    {
      value: "cash",
      label: "Cash",
    },
    {
      value: "cheque",
      label: "Cheque",
    },
    {
      value: "bank_transfer",
      label: "Bank Transfer",
    },
    {
      value: "credit_card",
      label: "Credit Card",
    },
  ];

  const closeModal = () => {
    setAddPaymentModal(false);
    // Reset form
    setData({
      billingId: selectedBilling?._id,
      amount: selectedBilling?.dueAmount || 0,
      date: new Date(),
      paymentMethod: "",
      note: "",
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Validate required fields
    if (!data.amount || !data.paymentMethod || !data.date) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      billingId: selectedBilling?._id,
      amount: Number(data.amount),
      date: moment(data.date).format("YYYY-MM-DD"),
      paymentMethod: data.paymentMethod,
      note: data.note || "",
      transactionId: data?.transactionId || "",
    };

    await userPrivateRequest.post("/api/payments", payload).then(response => {

      toast.success("Payment added successfully");
      setAddPaymentModal(false)
      closeModal();
      fetchPayments();
      fetchBillings();
    }).catch(error => {
      console.log(error?.message)
      toast.error(error?.message)
    }).finally(() => {
      setIsSubmitting(false)
    });
  };

  return (
    <Modal isOpen={addPaymentModal} close={closeModal}>
      <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
        <div className="max-h-full w-full overflow-hidden ti-modal-content">
          <div className="ti-modal-header">
            <h6 className="modal-title text-[1rem] font-semibold text-defaulttextcolor">
              Add Payment - Bill #{selectedBilling?.billNumber}
            </h6>
            <button
              type="button"
              className="hs-dropdown-toggle !text-[1rem] !font-semibold !text-defaulttextcolor"
              onClick={closeModal}
            >
              <span className="sr-only">Close</span>
              <i className="ri-close-line"></i>
            </button>
          </div>

          <div className="ti-modal-body px-4 overflow-y-auto">
            <div className="grid grid-cols-12 gap-4">
              {/* Payment Summary */}
              <div className="xl:col-span-12 col-span-12 bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span>Total Amount:</span>
                  <span>${selectedBilling?.grandTotal}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Already Paid:</span>
                  <span>${selectedBilling?.totalPaid}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Due Amount:</span>
                  <span>${selectedBilling?.dueAmount}</span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="xl:col-span-12 col-span-12">
                <label htmlFor="payment-amount" className="form-label">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="payment-amount"
                  placeholder="Enter Amount"
                  value={data.amount}
                  onChange={(e) =>
                    setData({ ...data, amount: parseFloat(e.target.value) })
                  }
                  max={selectedBilling?.dueAmount}
                />
              </div>

              {/* Payment Method */}
              <div className="xl:col-span-12 col-span-12">
                <label className="form-label">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <Select
                  name="paymentMethod"
                  options={paymentMethods}
                  className="basic-multi-select"
                  menuPlacement="auto"
                  classNamePrefix="Select2"
                  placeholder="Select Payment Method"
                  value={paymentMethods.find(
                    (m) => m.value === data.paymentMethod
                  )}
                  onChange={(e: any) => {
                    setData({ ...data, paymentMethod: e.value });
                  }}
                />
              </div>

              {/* Payment Date */}
              <div className="xl:col-span-12 col-span-12">
                <label className="form-label">
                  Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  className="form-control"
                  selected={data.date}
                  onChange={(date: Date) => setData({ ...data, date })}
                  dateFormat="yyyy-MM-dd"
                  maxDate={new Date()}
                  showIcon
                />
              </div>

              <div className="xl:col-span-12 col-span-12">
                <label className="form-label">Transaction ID</label>
                <input
                  className="form-control"
                  value={data?.transactionId}
                  onChange={(e) =>
                    setData({ ...data, transactionId: e.target.value })
                  }
                  placeholder="Enter Transaction ID"
                />
              </div>

              {/* Note */}
              <div className="xl:col-span-12 col-span-12">
                <label htmlFor="payment-note" className="form-label">
                  Note
                </label>
                <textarea
                  className="form-control !rounded-md border-1"
                  id="payment-note"
                  rows={2}
                  value={data.note}
                  onChange={(e) => setData({ ...data, note: e.target.value })}
                  placeholder="Enter payment note"
                />
              </div>
            </div>
          </div>

          <div className="ti-modal-footer">
            <button
              type="button"
              className="hs-dropdown-toggle ti-btn ti-btn-light align-middle"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="ti-btn bg-primary text-white !font-medium"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ButtonSpinner text="Adding Payment" />
              ) : (
                "Add Payment"
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddPaymentModal;
