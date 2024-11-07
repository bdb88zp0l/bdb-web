"use client";
import React, { useState } from "react";

import dynamic from "next/dynamic";

import { useConfig } from "@/shared/providers/ConfigProvider";
import CreatePayment from "@/shared/page-components/case-management/CreatePayment";

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import("react-select"), { ssr: false });
const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
});

const CaseTeamOverview = ({ showModalOpen, isCloseModal }: any) => {
  const config = useConfig();
  const [ModalOpen, setModalOpen] = useState(false);
  const isOpenModal = () => setModalOpen(true);
  const CloseModal = () => setModalOpen(false);
  return (
    <>
      {ModalOpen ? (
        <CreatePayment ModalOpen={ModalOpen} CloseModal={CloseModal} />
      ) : (
        <>
          {showModalOpen && (
            <>
              <div className="flex justify-end mt-6 gap-4">
                <button
                  onClick={isOpenModal}
                  className="ti-btn ti-btn-primary-full py-2 px-4"
                >
                  Add Payment
                </button>
                <button
                  onClick={isCloseModal}
                  className="ti-btn ti-btn-primary-full py-2 px-4"
                >
                  Cancel
                </button>
              </div>
              <div className="max-w-4xl mx-auto bg-white p-8 border border-defaultborder crm-contact mb-6">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                  <h1 className="text-3xl font-bold">Bill</h1>
                  <div className="text-right">
                    <p className="text-2xl font-bold">#00001</p>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <div>
                    <div className="mb-4">
                      <img src="#" alt="Logo" className="w-32" />
                    </div>
                    <p className="font-semibold">Bill From:</p>
                    <p>Avye Combs</p>
                    <p>
                      280 White Oak Extension, Dolorem ipsum itaque, Amazonas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">Bill To:</p>
                    <p>Moses Ford</p>
                  </div>
                  <div className="">
                    <label htmlFor="date" className="form-label">
                      Due Date:
                    </label>
                    <p className="text-sm">Jul 25, 1992</p>
                  </div>
                </div>
                <label htmlFor="date" className="form-label">
                  Status:
                </label>
                <div className="mb-6">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    PENDING
                  </span>
                </div>

                <p className="mb-4">Summary</p>

                <div className="table-responsive mb-6">
                  <table className="table whitespace-nowrap min-w-full">
                    <thead className="border border-defaultborder crm-contact bg-gray-400">
                      <tr>
                        <th scope="col" className="text-start">
                          #
                        </th>
                        <th scope="col" className="text-start">
                          PARTICULARS
                        </th>
                        <th scope="col" className="text-start">
                          NUMBERS
                        </th>
                        <th scope="col" className="text-start">
                          RATE/UNIT COST(USD)
                        </th>
                        <th scope="col" className="text-start">
                          Tax
                        </th>
                        <th scope="col" className="text-start">
                          Amount
                        </th>
                        <th scope="col" className="text-start"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        className="border border-defaultborder crm-contact"
                        key={Math.random()}
                      ></tr>
                      <tr className="border border-defaultborder crm-contact">
                        <td>
                          <p className="font-bold">1</p>
                        </td>
                        <td>
                          <p className="font-bold">Quo corporis sit nob </p>
                        </td>
                        <td>
                          <p className="font-bold">118</p>
                        </td>
                        <td>
                          <p className="font-bold">96</p>
                        </td>

                        <td>
                          <p className="font-bold">Sales tax (27%)</p>
                        </td>
                        <td>
                          <p className="font-bold">14386.56</p>
                        </td>
                      </tr>
                      <tr className="border border-defaultborder crm-contact">
                        <td colSpan={5} className="text-right">
                          <p className="text-right font-bold">Sub Total </p>
                        </td>
                        <td>11328.00</td>
                      </tr>
                      <tr className="border border-defaultborder crm-contact">
                        <td colSpan={5} className="text-right">
                          <p className="text-right font-bold">Total Tax</p>
                        </td>
                        <td>3058.56</td>
                      </tr>
                      <tr className="border border-defaultborder crm-contact">
                        <td colSpan={5} className="text-right">
                          <p className="text-right font-bold">Total Amount</p>
                        </td>
                        <td>14338.56</td>
                      </tr>
                      <tr className="border border-defaultborder crm-contact">
                        <td colSpan={5} className="text-right">
                          <p className="text-right font-bold">Due Amount</p>
                        </td>
                        <td>14338.56</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* payment */}
                <div className="border border-defaultborder crm-contact py-3 px-4 mb-6">
                  <h1 className="mt-4 mb-4 text-lg">Payments</h1>
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
                          <th scope="col" className="text-start">
                            Action
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default CaseTeamOverview;
