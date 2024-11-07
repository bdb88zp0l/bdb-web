"use client";
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import React, { useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Link from "next/link";
import DatePicker from "react-datepicker";
import CompanyForm from "../contacts/components/CompanyForm";
import PhoneForm from "../contacts/components/PhoneForm";
import AddressForm from "../contacts/components/AddressForm";
import moment from "moment";
import { useConfig } from "@/shared/providers/ConfigProvider";
import { getImageUrl, toWordUpperCase } from "@/utils/utils";

const Select = dynamic(() => import("react-select"), { ssr: false });

const CreateModal = ({ caseInfo, fetchBillings, pageData, modalOpen, setModalOpen }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const openModal = (e: any) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  // State to manage multiple emails, phones, addresses, and companies
  const [emails, setEmails] = useState([{ value: "" }]); // At least one email required
  const [phones, setPhones] = useState([
    { dialCode: "", phoneNumber: "", label: "" },
  ]); // At least one phone required

  const itemSkeleton = {
    patriculars: "",
    quantity: 1,
    price: 0,
    tax: 0,
    discount: 0,
    amount: 0
  }

  const [items, setItems] = useState([itemSkeleton])

  const calculateAmounts = (items: any[]) => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    items.forEach(item => {
      const itemTotal = item.quantity * item.price;
      const itemDiscount = itemTotal * (Number(item.discount) / 100);
      const itemTax = (itemTotal - itemDiscount) * (Number(item.tax) / 100);
      subtotal += itemTotal;
      totalDiscount += itemDiscount;
      totalTax += itemTax;
    });

    const totalAmount = subtotal - totalDiscount + totalTax;
    return { subtotal, totalDiscount, totalTax, totalAmount };
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleSubmit = async () => {

  };

  const config = useConfig();

  console.log("pageData", pageData)

  return (
    <>
      <Modal isOpen={modalOpen} close={closeModal}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center  min-w-[calc(100%-3.5rem)]">
          <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
            <div className="ti-modal-header">
              <h6
                className="modal-title text-[1rem] font-semibold text-defaulttextcolor"
                id="mail-ComposeLabel"
              >
                Create Billing
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

                <div className="col-span-4">
                  <div className="col-span-12 grid grid-cols-2 gap-x-4">
                    <label className="mb-2 font-bold">
                      Name:
                    </label>
                    <span>Company</span>

                    <label className="mb-2 font-bold">
                      Phone Number:
                    </label>
                    <span>8563256987</span>

                    <label className="mb-2 font-bold">
                      Address:
                    </label>
                    <span>This is address</span>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="col-span-12">
                    <label className="mb-2 form-label font-bold">
                      Bill To:
                    </label>
                    <div className="mb-4">
                      <label
                        htmlFor="billNumber"
                        className="form-label"
                      >
                        Client
                      </label>
                      <Select
                        name="client"
                        options={pageData?.clients?.map((option: any) => {
                          return {
                            value: option._id,
                            label: `${option?.companyName ?? ""} - ${option?.code ?? ""
                              }`,
                          };
                        })}
                        className="basic-multi-select"
                        menuPlacement="auto"
                        classNamePrefix="Select2"
                        placeholder="Select Client"
                        onChange={(e: any) => setData({ ...data, client: e.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="form-label"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="form-control w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="billNumber"
                      className="form-label"
                    >
                      Bill Number
                    </label>
                    <input
                      type="text"
                      id="billNumber"
                      name="billNumber"
                      className="form-control w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="billNumber"
                      className="form-label"
                    >
                      Billing Type
                    </label>
                    <Select
                      name="status"
                      options={[
                        { value: "oneTime", label: "One Time Billing" },
                        { value: "milestone", label: "Stage Billing" },
                        { value: "timeBased", label: "Based on time billing" },
                      ]}
                      className="basic-multi-select"
                      menuPlacement="auto"
                      classNamePrefix="Select2"
                      placeholder="Select Role"
                      defaultValue={{
                        value: data?.status,
                        label: toWordUpperCase(data?.status),
                      }}
                      onChange={(e: any) => {
                        setData({ ...data, s: e.value });
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-12 gap-4 col-span-12">
                    <div className="mb-4 col-span-6">
                      <label
                        htmlFor="date"
                        className="form-label"
                      >
                        Date
                      </label>
                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                        selected={data?.date}
                        onChange={(date) => {
                          setData({
                            ...data,
                            date: date,
                          });
                        }}
                        dateFormat="MMMM d, yyyy"
                      />
                    </div>
                    <div className="mb-4 col-span-6">
                      <label
                        htmlFor="dueDate"
                        className="form-label"
                      >
                        Due Date
                      </label>
                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                        selected={data?.dueDate}
                        onChange={(date) => {
                          setData({
                            ...data,
                            dueDate: date,
                          });
                        }}
                        dateFormat="MMMM d, yyyy"
                      />
                    </div>
                  </div>
                </div>
              </div>


              <div className="co-span-12 border border-defaultborder crm-contact p-2">
                <div className="flex justify-end">
                  <button className="ti-btn ti-btn-primary-full py-2 px-4" onClick={() => {
                    setItems([...items, itemSkeleton])
                  }}>
                    + Add item
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table whitespace-nowrap min-w-full">
                    <thead>
                      <tr>
                        <th scope="col" className="text-start">
                          Particulars
                        </th>
                        <th scope="col" className="text-start">
                          Number
                        </th>
                        <th scope="col" className="text-start">
                          Price
                        </th>
                        <th scope="col" className="text-start">
                          Discount(%)
                        </th>
                        <th scope="col" className="text-start">
                          Tax (%)
                        </th>
                        <th scope="col" className="text-start">
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="text-start"
                        ></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items?.map((item: any, index: number) => (
                        <tr className="border border-defaultborder crm-contact" key={index}>
                          <td>
                            <input
                              className="form-control me-2 h-[36.47px]"
                              type="text"
                              placeholder="Particulars"
                              value={item.patriculars}
                              onChange={(e) => handleItemChange(index, 'patriculars', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control me-2 h-[36.47px]"
                              type="number"
                              placeholder="Quantity"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control me-2 h-[36.47px]"
                              type="number"
                              placeholder="Price"
                              value={item.price}
                              onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control me-2 h-[36.47px]"
                              type="number"
                              placeholder="Discount"
                              value={item.discount}
                              onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value))}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control me-2 h-[36.47px]"
                              type="number"
                              placeholder="Tax"
                              value={item.tax}
                              onChange={(e) => handleItemChange(index, 'tax', parseFloat(e.target.value))}
                            />
                          </td>
                          <td>{(item.quantity * item.price * (1 - item.discount / 100) * (1 + item.tax / 100)).toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="border border-defaultborder crm-contact">
                        <td colSpan={5} className="text-right">
                          <p className="text-right font-bold">Subtotal</p>
                        </td>
                        <td>{calculateAmounts(items).subtotal.toFixed(2)}</td>
                      </tr>
                      <tr className="border border-defaultborder crm-contact">
                        <td colSpan={5} className="text-right">
                          <p className="text-right font-bold">Discount</p>
                        </td>
                        <td>{calculateAmounts(items).totalDiscount.toFixed(2)}</td>
                      </tr>
                      <tr className="border border-defaultborder crm-contact">
                        <td colSpan={5} className="text-right">
                          <p className="text-right font-bold">Tax</p>
                        </td>
                        <td>{calculateAmounts(items).totalTax.toFixed(2)}</td>
                      </tr>
                      <tr className="border border-defaultborder crm-contact">
                        <td colSpan={5} className="text-right">
                          <p className="text-right font-bold">Total Amount</p>
                        </td>
                        <td>{calculateAmounts(items).totalAmount.toFixed(2)}</td>
                      </tr>

                      <tr className="border border-defaultborder crm-contact">
                        <td colSpan={6}>
                          <textarea
                            placeholder="Description"
                            name=""
                            id=""
                            rows={2}
                            cols={50}
                          ></textarea>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="ti-modal-footer">
              <button
                type="button"
                className="hs-dropdown-toggle ti-btn  ti-btn-light align-middle"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ti-btn bg-primary text-white !font-medium"
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedCompany}
              >
                {isSubmitting ? (
                  <ButtonSpinner text="Creating" />
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal >
    </>
  );
};

export default CreateModal;
