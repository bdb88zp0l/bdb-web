"use client";
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import React, { useEffect, useState } from "react";
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
import store from "@/shared/redux/store";

const Select = dynamic(() => import("react-select"), { ssr: false });

const CreateModal = ({
  caseInfo,
  fetchBillings,
  pageData,
  modalOpen,
  setModalOpen,
}: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>({
    // title: "",
    case: caseInfo?._id,
    billingType: "oneTime",
    currency: "PHP",
    billNumber: "",
    note: "",
    date: new Date(),
    dueDate: new Date(),
  });

  useEffect(() => {
    if (caseInfo) {
      setData({ ...data, case: caseInfo?._id });
    }
  }, [caseInfo]);

  const closeModal = () => setModalOpen(false);
  const itemSkeleton = {
    particulars: "",
    quantity: 1,
    price: 0,
    discount: 0,
    vat: 0,
    amount: 0,
  };

  const [items, setItems] = useState([itemSkeleton]);

  const calculateAmounts = (items: any[]) => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalVat = 0;

    items.forEach((item) => {
      const itemTotal = item.quantity * item.price;
      const itemDiscount = itemTotal * (Number(item.discount) / 100);
      const itemVat =
        item.vat?.type == "percentage"
          ? ((itemTotal - itemDiscount) * item?.vat?.rate) / 100
          : item?.vat?.type == "flat"
          ? item?.vat?.rate
          : 0;
      item.amount = itemTotal;
      subtotal += itemTotal;
      totalDiscount += itemDiscount;
      totalVat += itemVat;
    });

    const totalAmount = subtotal - totalDiscount + totalVat;
    return { subtotal, totalDiscount, totalVat, totalAmount };
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      ...data,
      items: items.map((item) => ({
        particulars: item.particulars,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        vat: item.vat,
        amount: item.quantity * item.price,
      })),
    };

    await userPrivateRequest
      .post("/api/billing", payload)
      .then((res) => {
        toast.success("Billing created successfully");
        fetchBillings();
        closeModal();
      })
      .catch((error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to create billing"
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleBillingTypeChange = () => {
    setItems([itemSkeleton]);

    if (data?.billingType == "timeBased") {
      userPrivateRequest
        .get(`/api/hrm/dsr/getDsrRecordsByCase/${caseInfo?._id}`, {
          params: {
            ...(data?.billingStart && {
              billingStart: moment(data?.billingStart).format("YYYY-MM-DD"),
            }),
            ...(data?.billingEnd && {
              billingEnd: moment(data?.billingEnd).format("YYYY-MM-DD"),
            }),
          },
        })
        .then((response) => {
          let abc = response?.data?.data ?? [];
          let tempItems = abc?.map((item) => {
            return {
              particulars: item?.task ?? "",
              quantity: item?.hourCount ?? 0,
              price: item?.hourlyRate ?? 0,
              discount: 0,
              vat: 0,
              amount:
                Number(item?.hourCount ?? 0) * Number(item?.hourlyRate ?? 0),
            };
          });

          setItems(tempItems);
        })
        .catch((error) => {
          console.log(error?.message);
        })
        .finally(() => {});
    }
  };

  useEffect(() => {
    handleBillingTypeChange();
  }, [data?.billingType, data?.billingStart, data?.billingEnd]);

  const config = useConfig();

  const { auth } = store.getState();

  console.log(items);
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
                  {/* <label className="mb-2 font-bold text-[16px]">Bill From:</label> */}
                  <div className="col-span-12 flex flex-col gap-4">
                    {/* <label className="mb-2 font-bold">Name:</label> */}
                    <span>{auth?.user?.defaultWorkspace?.name ?? ""}</span>

                    {/* <label className="mb-2 font-bold">Phone Number:</label> */}
                    <span>{auth?.user?.defaultWorkspace?.phone ?? ""}</span>

                    {/* <label className="mb-2 font-bold">Email:</label> */}
                    <span>{auth?.user?.defaultWorkspace?.email ?? ""}</span>

                    {/* <label className="mb-2 font-bold">Address:</label> */}
                    <span>
                      {auth?.user?.defaultWorkspace?.addressLine1 ?? ""}
                      <br />
                      {auth?.user?.defaultWorkspace?.addressLine2 ?? ""}
                    </span>
                  </div>
                </div>

                <div className="col-span-4">
                  {/* <label className="mb-2 font-bold text-[16px]">Bill To:</label> */}
                  <div className="col-span-12 flex flex-col gap-4">
                    {/* <label className="mb-2 font-bold">Name:</label> */}
                    <span>{caseInfo?.client?.companyName ?? ""}</span>

                    {/* <label className="mb-2 font-bold">Phone Number:</label> */}
                    <span>
                      {caseInfo?.client?.phones?.map((item, index) => (
                        <React.Fragment key={index}>
                          <span>
                            {item?.dialCode} {item?.phoneNumber}
                          </span>
                          <br />
                        </React.Fragment>
                      ))}
                    </span>

                    {/* <label className="mb-2 font-bold">Email:</label> */}
                    <span>
                      {caseInfo?.client?.emails?.map((item, index) => (
                        <React.Fragment key={index}>
                          <span>{item?.value}</span>
                          <br />
                        </React.Fragment>
                      ))}
                    </span>

                    {/* <label className="mb-2 font-bold">Address:</label> */}
                    <span>
                      {caseInfo?.client?.addresses?.map((address, index) => (
                        <div key={index}>
                          {`${address.houseNumber || "N/A"}, ${
                            address.street || "N/A"
                          }, ${address.city || "N/A"}, ${
                            address.barangay || "N/A"
                          }, ${address.zip || "N/A"}, ${
                            address.region || "N/A"
                          }, ${address.country || "N/A"}`}
                          <span className="badge bg-light text-[#8c9097] dark:text-white/50 m-1">
                            {address?.label}
                          </span>
                        </div>
                      ))}
                    </span>
                  </div>
                </div>

                <div className="col-span-4">
                  {/* <div className="mb-4">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="form-control w-full p-2 border border-gray-300 rounded-md"
                      value={data?.title}
                      onChange={(e) => {
                        setData({ ...data, title: e.target.value });
                      }}
                    />
                  </div> */}

                  <div className="mb-4">
                    <label htmlFor="currency" className="form-label">
                      Currency
                    </label>
                    <Select
                      name="currency"
                      options={config?.BILLING_CURRENCIES?.map(
                        (option: any) => {
                          return {
                            value: option,
                            label: `${option}`,
                          };
                        }
                      )}
                      className="basic-multi-select"
                      menuPlacement="auto"
                      classNamePrefix="Select2"
                      placeholder="Select Currency"
                      value={
                        config?.BILLING_CURRENCIES?.map((option: any) => ({
                          value: option,
                          label: `${option}`,
                        }))?.find(
                          (option: any) => option.value === data?.currency
                        ) || null
                      }
                      onChange={(e: any) =>
                        setData({ ...data, currency: e.value })
                      }
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="billNumber" className="form-label">
                      Bill Number
                    </label>
                    <input
                      type="text"
                      id="billNumber"
                      name="billNumber"
                      className="form-control w-full p-2 border border-gray-300 rounded-md"
                      value={data?.billNumber}
                      onChange={(e) => {
                        setData({ ...data, billNumber: e.target.value });
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="billNumber" className="form-label">
                      Billing Type
                    </label>
                    <Select
                      name="billingType"
                      options={[
                        { value: "oneTime", label: "One Time Billing" },
                        { value: "progressBased", label: "Progress Billing" },
                        { value: "timeBased", label: "Time-Based Billing" },
                        { value: "taskBased", label: "Task-Based Billing" },
                      ]}
                      className="basic-multi-select"
                      menuPlacement="auto"
                      classNamePrefix="Select2"
                      placeholder="Select Billing Type"
                      onChange={(e: any) => {
                        setData({ ...data, billingType: e.value });
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-12 gap-4 col-span-12">
                    <div className="mb-4 col-span-6">
                      <label htmlFor="billingStart" className="form-label">
                        Billing Start
                      </label>
                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                        selected={data?.billingStart}
                        onChange={(billingStart) => {
                          setData({
                            ...data,
                            billingStart: billingStart,
                          });
                        }}
                        dateFormat="MMMM d, yyyy"
                      />
                    </div>

                    {data?.billingType == "timeBased" && (
                      <div className="mb-4 col-span-6">
                        <label htmlFor="billingEnd" className="form-label">
                          Billing End
                        </label>
                        <DatePicker
                          className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                          selected={data?.billingEnd}
                          onChange={(billingEnd) => {
                            setData({
                              ...data,
                              billingEnd: billingEnd,
                            });
                          }}
                          dateFormat="MMMM d, yyyy"
                        />
                      </div>
                    )}
                    <div className="mb-4 col-span-6">
                      <label htmlFor="dueDate" className="form-label">
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
                {data?.billingType !== "timeBased" && (
                  <div className="flex justify-end">
                    <button
                      className="ti-btn ti-btn-primary-full py-2 px-4"
                      onClick={() => {
                        setItems([...items, itemSkeleton]);
                      }}
                    >
                      + Add item
                    </button>
                  </div>
                )}
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
                          VAT
                        </th>
                        <th scope="col" className="text-start">
                          Amount
                        </th>
                        <th scope="col" className="text-start"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items?.map((item: any, index: number) => (
                        <tr
                          className="border border-defaultborder crm-contact"
                          key={index}
                        >
                          <td>
                            <input
                              className="form-control me-2 h-[36.47px]"
                              type="text"
                              placeholder="Particulars"
                              value={item.particulars}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "particulars",
                                  e.target.value
                                )
                              }
                              // disabled={data?.billingType == "timeBased"}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control me-2 h-[36.47px]"
                              type="number"
                              placeholder="Quantity"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "quantity",
                                  parseFloat(e.target.value)
                                )
                              }
                              // disabled={data?.billingType == "timeBased"}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control me-2 h-[36.47px]"
                              type="number"
                              placeholder="Price"
                              value={item.price}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "price",
                                  parseFloat(e.target.value)
                                )
                              }
                              // disabled={data?.billingType == "timeBased"}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control me-2 h-[36.47px]"
                              type="number"
                              placeholder="Discount"
                              value={item.discount}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "discount",
                                  parseFloat(e.target.value)
                                )
                              }
                              // disabled={data?.billingType == "timeBased"}
                            />
                          </td>
                          <td>
                            {/* <input
                              className="form-control me-2 h-[36.47px]"
                              type="number"
                              placeholder="VAT"
                              value={item.vat}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "vat",
                                  parseFloat(e.target.value)
                                )
                              }
                              disabled={data?.billingType == "timeBased"}
                            /> */}

                            <Select
                              name="vatSetting"
                              options={config?.VAT_SETTINGS?.map(
                                (option: any) => {
                                  return {
                                    value: option,
                                    label:
                                      option.type === "percentage"
                                        ? `${option.rate}%`
                                        : `Flat Rate: ${option.rate} ${
                                            data?.currency ?? "PHP"
                                          }`,
                                  };
                                }
                              )}
                              className="basic-multi-select"
                              menuPlacement="auto"
                              classNamePrefix="Select2"
                              placeholder="Select VAT"
                              onChange={(e: any) =>
                                handleItemChange(index, "vat", e.value)
                              }
                              // isDisabled={data?.billingType == "timeBased"}
                            />
                          </td>
                          <td>
                            {(
                              item.quantity *
                                item.price *
                                (1 - item.discount / 100) +
                              (item.vat?.type == "percentage"
                                ? (item.quantity *
                                    item.price *
                                    (1 - item.discount / 100) *
                                    item?.vat?.rate) /
                                  100
                                : item?.vat?.type == "flat"
                                ? item?.vat?.rate
                                : 0)
                            ).toFixed(2)}
                          </td>
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
                        <td>
                          {calculateAmounts(items).totalDiscount.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="border border-defaultborder crm-contact">
                        <td colSpan={5} className="text-right">
                          <p className="text-right font-bold">VAT</p>
                        </td>
                        <td>{calculateAmounts(items).totalVat.toFixed(2)}</td>
                      </tr>
                      <tr className="border border-defaultborder crm-contact">
                        <td colSpan={5} className="text-right">
                          <p className="text-right font-bold">Total Amount</p>
                        </td>
                        <td>
                          {calculateAmounts(items).totalAmount.toFixed(2)}
                        </td>
                      </tr>

                      <tr className="border border-defaultborder crm-contact">
                        <td colSpan={6}>
                          <textarea
                            placeholder="Description"
                            value={data.note}
                            onChange={(e) =>
                              setData({ ...data, note: e.target.value })
                            }
                            rows={2}
                            cols={50}
                          />
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
                disabled={isSubmitting}
              >
                {isSubmitting ? <ButtonSpinner text="Creating" /> : "Create"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateModal;
