"use client";
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import { useConfig } from "@/shared/providers/ConfigProvider";
import moment from "moment";
import dynamic from "next/dynamic";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import AddressForm from "../contacts/components/AddressForm";
import PhoneForm from "../contacts/components/PhoneForm";

const Select = dynamic(() => import("react-select"), { ssr: false });

const UpdateModal = ({ row, fetchClients, pageData, fetchPageData,isEditModalOpen,setIsEditModalOpen }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState<any>(row);

  const openModal = (e: any) => {
    e.preventDefault();
    setIsEditModalOpen(true);
  };
  const toggleEditMode = () => {
    setIsDisabled(!isDisabled);
  };
  const closeModal = () => setIsEditModalOpen(false);

  // State to manage multiple emails, phones, addresses, and companies
  const [emails, setEmails] = useState(row?.emails ?? [{ value: "" }]); // At least one email required
  const [phones, setPhones] = useState(
    row?.phones ?? [{ dialCode: "", phoneNumber: "", label: "" }]
  ); // At least one phone required
  const [addresses, setAddresses] = useState(
    row?.addresses ?? [
      {
        houseNumber: "",
        building: "",
        street: "",
        city: "",
        barangay: "",
        zip: "",
        region: "",
        country: "",
        label: "",
      },
    ]
  ); // At least one address required

  const handleFieldChange = (
    setter: any,
    getter: any,
    index: number,
    field: string,
    value: string
  ) => {
    const updatedFields = [...getter];
    updatedFields[index][field] = value;
    setter(updatedFields);
  };
  const addField = (setter: any, field: any[]) => {
    setter([...field, { value: "" }]);
  };

  const removeField = (setter: any, field: any[], index: number) => {
    const newField = [...field];
    newField.splice(index, 1);
    setter(newField);
  };

  const handleSubmit = async () => {
    if (!row) {
      toast.error("Please select a company");
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    if (data?.clientNumber) {
      formData.append("clientNumber", data?.clientNumber);
    }
    formData.append("status", data?.status);
    formData.append("accountType", data?.accountType);
    formData.append("withdrawnAt", data?.withdrawnAt);
    formData.append("engagedAt", data?.engagedAt);
    formData.append("addresses", JSON.stringify(addresses));
    formData.append("emails", JSON.stringify(emails));
    formData.append("phones", JSON.stringify(phones));
    try {
      const res = await userPrivateRequest.patch(
        `/api/clients/${row?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for form-data
          },
        }
      );

      toast.success(res.data?.message);
      fetchClients(); // Refresh the user list
      setData({}); // Reset form
      closeModal(); // Close modal
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const config = useConfig();
  const statuses = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Withdrawn", value: "withdrawn" },
  ];

  return (
    <>
      
      <Modal isOpen={isEditModalOpen} close={closeModal}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center  min-w-[calc(100%-3.5rem)]">
          <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
            <div className="ti-modal-header">
              <div className="flex gap-2.5 items-center">
                  <h6
                  className="modal-title text-[1rem] font-semibold text-defaulttextcolor"
                  id="mail-ComposeLabel"
                >
                  {isDisabled ? 'Client Details' : 'Update Client'}
                </h6>
                <button aria-label="button" type="button" className="ti-btn ti-btn-sm ti-btn-info ti-btn-icon  me-2"
                onClick={toggleEditMode} ><i className="ri-pencil-line"></i></button>
              </div>
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
                {/* Company Information */}
                <div className="col-span-12">
                  <label htmlFor="basic" className="mt-2 text-[18px]">
                    Company Information
                  </label>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <div className="grid grid-cols-12 gap-4 mb-4"></div>

                  {row && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      {/* Company Name */}
                      <div>
                        <label htmlFor="companyName" className="form-label">
                          Company Name
                        </label>

                        <input
                          disabled
                          type="text"
                          className="form-control"
                          value={row?.companyName}
                        />
                      </div>

                      {/* Company Group */}
                      <div className="">
                        <label htmlFor="companyGroup" className="form-label">
                          Company Group
                        </label>

                        <input
                          disabled
                          type="text"
                          className="form-control"
                          value={row?.companyGroup?.name}
                        />
                      </div>

                      {/* TIN */}
                      <div>
                        <label htmlFor="tin" className="form-label">
                          Taxpayer Identification Number (TIN)
                        </label>
                        <input
                          disabled
                          type="text"
                          className="form-control"
                          value={row?.tin}
                        />
                      </div>

                      {/* Industry */}
                      <div>
                        <label htmlFor="industry" className="form-label">
                          Industry
                        </label>
                        <input
                          disabled
                          type="text"
                          className="form-control"
                          value={row?.industry}
                        />
                      </div>

                      {/* Business Style */}
                      <div>
                        <label htmlFor="businessStyle" className="form-label">
                          Business Style
                        </label>
                        <input
                          disabled
                          type="text"
                          className="form-control"
                          value={row?.businessStyle}
                        />
                      </div>

                      {/* Supervising Partner */}
                      <div>
                        <label
                          htmlFor="supervisingPartner"
                          className="form-label"
                        >
                          Supervising Partner
                        </label>
                        <input
                          disabled
                          type="text"
                          className="form-control"
                          value={`${row?.supervisingPartner?.firstName ?? ""} ${row?.supervisingPartner?.lastName ?? ""
                            }`}
                        />
                      </div>

                      {/* Referred By */}
                      <div>
                        <label htmlFor="referredBy" className="form-label">
                          Referred By
                        </label>
                        <input
                          disabled
                          type="text"
                          className="form-control"
                          value={`${row?.referredBy?.firstName ?? ""} ${row?.referredBy?.lastName ?? ""
                            }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-span-6">
                  {row && (
                    <div className="text-center flex justify-center items-center flex-col">
                      <span
                        className="avatar avatar-xxl"
                        style={{
                          height: "200px",
                          width: "fit-content",
                        }}
                      >
                        <img
                          src={
                            row?.logo
                              ? `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${row?.logo}`
                              : "../../../assets/images/faces/9.jpg"
                          }
                          alt="Profile Image"
                          id="profile-img"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </span>
                    </div>
                  )}
                </div>

                {/* Engagement Information */}
                <div className="col-span-12">
                  <label htmlFor="basic" className="mt-2 text-[18px]">
                    Engagement Information
                  </label>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-6">
                      <label htmlFor="clientCode" className="form-label">
                        Client Code
                      </label>
                      <input
                        type="text"
                        disabled={isDisabled}
                        className="form-control"
                        id="clientCode"
                        placeholder="Client Code"
                        value={data?.clientNumber || ""}
                        onChange={(e) =>
                          setData({
                            ...data,
                            clientNumber: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-span-6">
                      <label className="form-label">Account Type</label>
                      <Select
                        name="accountType"
                        isDisabled={isDisabled} 
                        options={config?.CLIENT_ACCOUNT_TYPE?.map((option) => {
                          return {
                            value: option,
                            label: option,
                          };
                        })}
                        className="basic-multi-select"
                        menuPlacement="auto"
                        classNamePrefix="Select2"
                        placeholder="Select Account Type"
                        onChange={(e: any) =>
                          setData({ ...data, accountType: e.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label htmlFor="dateEngaged" className="form-label">
                        Date Engaged
                      </label>
                      <DatePicker
                        disabled={isDisabled}
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                        showIcon
                        selected={
                          data?.engagedAt
                            ? moment(data?.engagedAt).toDate()
                            : null
                        }
                        onChange={(date) =>
                          setData({
                            ...data,
                            engagedAt: date,
                          })
                        }
                      />
                    </div>

                    <div className="col-span-6">
                      <label className="form-label">Status</label>
                      <Select
                        isDisabled={isDisabled}
                        name="status"
                        options={[
                          { label: "Active", value: "active" },
                          { label: "Inactive", value: "inactive" },
                          { label: "Withdrawn", value: "withdrawn" },
                        ]}
                        className="basic-multi-select"
                        menuPlacement="auto"
                        classNamePrefix="Select2"
                        placeholder="Status"
                        onChange={(e: any) =>
                          setData({ ...data, status: e.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label htmlFor="dateWithdrawn" className="form-label">
                        Date Withdrawn
                      </label>
                      <DatePicker
                        disabled={isDisabled}
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                        showIcon
                        selected={
                          data?.withdrawnAt
                            ? moment(data?.withdrawnAt).toDate()
                            : null
                        }
                        onChange={(date) =>
                          setData({
                            ...data,
                            withdrawnAt: date,
                          })
                        }
                      />
                    </div>


                  </div>

                </div>

                <div className="xl:col-span-6 col-span-12">
                  <div className="xl:col-span-12 col-span-12">
                    <div className="col-span-6">
                      <label htmlFor="contact-mail" className="form-label">
                        Point of Contact
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`${row?.contact?.firstName ?? ""} ${row?.contact?.lastName ?? ""
                          }`}
                        disabled
                      />
                      </div>
                  </div>
                </div>

                <div className="col-span-12">
                  <label htmlFor="basic" className="mt-2 text-[18px]">
                    Contact Information
                  </label>
                </div>


                <div className="col-span-6">
                  <label htmlFor="emails" className="form-label">
                    Emails
                  </label>
                  {emails.map((email, index) => (
                    <div key={index} className="flex gap-2 items-center mb-2">
                      <input
                        type="email"
                        disabled={isDisabled}
                        className="form-control"
                        placeholder="Enter Email"
                        value={email.value}
                        onChange={(e) =>
                          handleFieldChange(
                            setEmails,
                            emails,
                            index,
                            "value",
                            e.target.value
                          )
                        }
                      />
                      {index !== 0 && !isDisabled && (
                        <button
                          type="button"
                          className="ti-btn ti-btn-danger ti-btn-xs"
                          onClick={() => removeField(setEmails, emails, index)}
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                  {!isDisabled && (
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 ti-btn bg-primary text-white !font-medium"
                      onClick={() => addField(setEmails, emails)}
                    >
                      + Add Email
                    </button>
                  )}
                </div>


                {/* Phone Information */}
                <PhoneForm
                  phones={phones}
                  isDisabled={isDisabled}
                  setPhones={setPhones}
                  addField={addField}
                  removeField={removeField}
                />

                {/* Address Information */}
                <AddressForm
                  isDisabled={isDisabled}
                  addresses={addresses}
                  setAddresses={setAddresses}
                  addField={addField}
                  removeField={removeField}
                />
              </div>
            </div>

            <div className="ti-modal-footer">
              <button
                type="button"
                className="hs-dropdown-toggle ti-btn  ti-btn-light align-middle"
                onClick={closeModal}
              >
                Close
              </button>
              {!isDisabled && (
                <button
                  type="button"
                  className="ti-btn bg-primary text-white !font-medium"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !row}
                >
                  {isSubmitting ? (
                    <ButtonSpinner text="Updating Client" />
                  ) : (
                    "Update Client"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UpdateModal;
