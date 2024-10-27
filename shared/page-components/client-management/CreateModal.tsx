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
import { getImageUrl } from "@/utils/utils";

const Select = dynamic(() => import("react-select"), { ssr: false });

const CreateModal = ({ fetchClients, pageData, fetchPageData }: any) => {
  const [modalOpen, setModalOpen] = useState(false);
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
  const [addresses, setAddresses] = useState([
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
  ]); // At least one address required

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
    if (!selectedCompany) {
      toast.error("Please select a company");
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    if (data?.clientNumber) {
      formData.append("clientNumber", data?.clientNumber);
    }
    formData.append("status", data?.status);
    if (data?.accountType) {
      formData.append("accountType", data?.accountType);
    }
    if (data?.withdrawnAt) {
      formData.append("withdrawnAt", data?.withdrawnAt);
    }
    if (data?.engagedAt) {
      formData.append("engagedAt", data?.engagedAt);
    }
    formData.append("addresses", JSON.stringify(addresses));
    formData.append("emails", JSON.stringify(emails));
    formData.append("phones", JSON.stringify(phones));
    try {
      const res = await userPrivateRequest.patch(
        `/api/clients/${selectedCompany?._id}`,
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

  return (
    <>
      <Link
        href="#!"
        scroll={false}
        className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem] me-2"
        onClick={openModal}
      >
        <i className="ri-add-line font-semibold align-middle"></i>
        Create Client
      </Link>
      <Modal isOpen={modalOpen} close={closeModal}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center  min-w-[calc(100%-3.5rem)]">
          <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
            <div className="ti-modal-header">
              <h6
                className="modal-title text-[1rem] font-semibold text-defaulttextcolor"
                id="mail-ComposeLabel"
              >
                Create Client
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
                {/* Company Information */}
                <div className="col-span-12">
                  <label htmlFor="basic" className="mt-2 text-[18px]">
                    Company Information
                  </label>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-6">
                      <label className="form-label">Select Company</label>
                      <Select
                        name="accountType"
                        options={pageData?.draftCompanies?.map(
                          (option: any) => {
                            return {
                              value: option._id,
                              label: option.companyName,
                            };
                          }
                        )}
                        className="basic-multi-select"
                        menuPlacement="auto"
                        classNamePrefix="Select2"
                        placeholder="Select Company"
                        onChange={(e: any) => {
                          setData({ ...data, company: e.value });
                          userPrivateRequest
                            .get(`/api/clients/${e.value}`)
                            .then((response) => {
                              let temp = response.data?.data?.client ?? null;
                              setSelectedCompany(temp);
                              setData({
                                clientNumber: temp?.clientNumber,
                                status: "active",
                              });
                            })
                            .catch((error) => {
                              console.log(error.response.data);
                            });
                        }}
                      />
                    </div>
                  </div>

                  {selectedCompany && (
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
                          value={selectedCompany?.companyName}
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
                          value={selectedCompany?.companyGroup?.name}
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
                          value={selectedCompany?.tin}
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
                          value={selectedCompany?.industry}
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
                          value={selectedCompany?.businessStyle}
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
                          value={`${selectedCompany?.supervisingPartner?.firstName ?? ""
                            } ${selectedCompany?.supervisingPartner?.lastName ?? ""
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
                          value={`${selectedCompany?.referredBy?.firstName ?? ""
                            } ${selectedCompany?.referredBy?.lastName ?? ""}`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-span-6">
                  {selectedCompany && (
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
                            selectedCompany?.logo
                              ? `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${selectedCompany?.logo}`
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

                    <div className="col-span-6 mb-4">
                      <label htmlFor="pointOfContact" className="form-label">
                        Point of Contact
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`${selectedCompany?.contact?.firstName ?? ""
                          } ${selectedCompany?.contact?.lastName ?? ""}`}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-6">
                      <label
                        htmlFor="clienttype"
                        className="form-label"
                      >
                        CLIENTTYPE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="clienttype"
                        placeholder="CLIENTTYPE"
                      />
                    </div>
                    <div className="col-span-6">
                      <label
                        htmlFor="Retainerfee"
                        className="form-label"
                      >
                        RETAINERFEE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="Retainerfee"
                        placeholder="RETAINERFEE"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="lastbillingexcess"
                        className="form-label"
                      >
                        LASTBILLINGEXCESS
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastbillingexcess"
                        placeholder="LASTBILLINGEXCESS"
                      />
                    </div>
                    <div className="col-span-6">
                      <label
                        htmlFor="withvat"
                        className="form-label"
                      >
                        WITHVAT
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="withvat"
                        placeholder="WITHVAT"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="vattpct"
                        className="form-label"
                      >
                        VATPCT
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vattpct"
                        placeholder="VATPCT"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="isactive"
                        className="form-label"
                      >
                        ISACTIVE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ISACTIVE"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="perservicecateg"
                        className="form-label"
                      >
                        PERSERVICECATEG
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="perservicecateg"
                        placeholder="PERSERVICECATEG"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="datestarbill"
                        className="form-label"
                      >
                        DATESTARTBILL
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="DATESTARTBILL"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="rateperhour"
                        className="form-label"
                      >
                        RATEPERHOUR
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="rateperhour"
                        placeholder="RATEPERHOUR"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="accounttype"
                        className="form-label"
                      >
                        ACCOUNTTYPE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ACCOUNTTYPE"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="cellon"
                        className="form-label"
                      >
                        CELINO
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cellon"
                        placeholder="CELINO"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="currency"
                        className="form-label"
                      >
                        CURRENCY
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="CURRENCY"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="sp_rate"
                        className="form-label"
                      >
                        SP_RATE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="sp_rate"
                        placeholder="SP_RATE"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="sa_rate"
                        className="form-label"
                      >
                        SA_RATE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="SA_RATE"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="jp_rate"
                        className="form-label"
                      >
                        JP_RATE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="jp_rate"
                        placeholder="JP_RATE"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="ja_rate"
                        className="form-label"
                      >
                        JA_RATE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="JA_RATE"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="billtoperson"
                        className="form-label"
                      >
                        Bill To Person
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="billtoperson"
                        placeholder="Bill To Person"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="billtoposition"
                        className="form-label"
                      >
                        Bill To Position
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Bill To Position"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="billtoperson2"
                        className="form-label"
                      >
                        Bill To Person 2
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="billtoperson2"
                        placeholder="Bill To Person 2"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="billtoposition2"
                        className="form-label"
                      >
                        Bill To Position 2
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Bill To Position 2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="clientnox"
                        className="form-label"
                      >
                        Client Nox
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="clientnox"
                        placeholder="Client Nox"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="acctlocation"
                        className="form-label"
                      >
                        ACCTLOCATION
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ACCTLOCATION"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="acctdateactivated"
                        className="form-label"
                      >
                        ACCTDATEACTIVATED
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="acctdateactivated"
                        placeholder="ACCTDATEACTIVATED"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="acctstatus"
                        className="form-label"
                      >
                        ACCTSTATUS
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ACCTSTATUS"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="acctstatusdatechanged"
                        className="form-label"
                      >
                        ACCTSTATUSDATECHANGED
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="acctstatusdatechanged"
                        placeholder="ACCTSTATUSDATECHANGED"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="partnerlawyerid"
                        className="form-label"
                      >
                        PARTNERLAYWERID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="PARTNERLAYWERID"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="paralegalrateperhour"
                        className="form-label"
                      >
                        PARALEGALRATEPERHOUR
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="paralegalrateperhour"
                        placeholder="PARALEGALRATEPERHOUR"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="clientcredit"
                        className="form-label"
                      >
                        CLIENTCREDIT
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="CLIENTCREDIT"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="vattype"
                        className="form-label"
                      >
                        VATTYPE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vattype"
                        placeholder="VATTYPE"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="usecustombillingformat"
                        className="form-label"
                      >
                        USECUSTOMBILLINGFORMAT
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="USECUSTOMBILLINGFORMAT"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="retainercaseid"
                        className="form-label"
                      >
                        RETAINERCASEID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="retainercaseid"
                        placeholder="RETAINERCASEID"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="retainermovingfee"
                        className="form-label"
                      >
                        RETAINERMOVINGFEE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="RETAINERMOVINGFEE"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="retainermonthlyamtcap"
                        className="form-label"
                      >
                        RETAINERMONTHLYAMTCAP
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="retainermonthlyamtcap"
                        placeholder="RETAINERMONTHLYAMTCAP"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="retainerdiscountpct"
                        className="form-label"
                      >
                        RETAINERDISCOUNTPCT
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="RETAINERDISCOUNTPCT"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="retainerfixedhrrate"
                        className="form-label"
                      >
                        RETAINERFIXEDHRRATE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="retainerfixedhrrate"
                        placeholder="RETAINERFIXEDHRRATE"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="lc_rate"
                        className="form-label"
                      >
                        LC_RATE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="LC_RATE"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="customclientcode"
                        className="form-label"
                      >
                        CUSTOMCLIENTCODE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="customclientcode"
                        placeholder="CUSTOMCLIENTCODE"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="opechargetype"
                        className="form-label"
                      >
                        OPECHARGETYPE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="OPECHARGETYPE"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="opechargevalue"
                        className="form-label"
                      >
                        OPECHARGEVALUE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="opechargevalue"
                        placeholder="OPECHARGEVALUE"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="clientshortname"
                        className="form-label"
                      >
                        CLIENTSHORTNAME
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="CLIENTSHORTNAME"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="soa_maincaption"
                        className="form-label"
                      >
                        SOA_MAINCAPTION
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="soa_maincaption"
                        placeholder="SOA_MAINCAPTION"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="soa_shortcaption"
                        className="form-label"
                      >
                        SOA_SHORTCAPTION
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="SOA_SHORTCAPTION"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="jt_rate"
                        className="form-label"
                      >
                        JT_RATE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="jt_rate"
                        placeholder="JT_RATE"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="clienttypesub"
                        className="form-label"
                      >
                        CLIENTTYPESUB
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="CLIENTTYPESUB"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="countryid"
                        className="form-label"
                      >
                        COUNTRYID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="countryid"
                        placeholder="COUNTRYID"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="oldaddressline1"
                        className="form-label"
                      >
                        OLD_ADDRESSLINE1
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="OLD_ADDRESSLINE1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="old_addressline2"
                        className="form-label"
                      >
                        OLD_ADDRESSLINE2
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="old_addressline2"
                        placeholder="OLD_ADDRESSLINE2"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="old_barangay"
                        className="form-label"
                      >
                        OLD_BARANGAY
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="OLD_BARANGAY"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="old_town_city"
                        className="form-label"
                      >
                        OLD_TOWN_CITY
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="old_town_city"
                        placeholder="OLD_TOWN_CITY"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="old_province_state"
                        className="form-label"
                      >
                        OLD_PROVINCE_STATE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="OLD_PROVINCE_STATE"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="clientgroupid"
                        className="form-label"
                      >
                        CLIENTGROUPID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="clientgroupid"
                        placeholder="CLIENTGROUPID"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="entrydate"
                        className="form-label"
                      >
                        ENTRYDATE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ENTRYDATE"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="retainerperiod"
                        className="form-label"
                      >
                        RETAINERPERIOD
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="retainerperiod"
                        placeholder="RETAINERPERIOD"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="othercontactinfo"
                        className="form-label"
                      >
                        OTHERCONTACTINFO
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="OTHERCONTACTINFO"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="retainerfeetopeso"
                        className="form-label"
                      >
                        RETAINERFEETOPESO
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="retainerfeetopeso"
                        placeholder="RETAINERFEETOPESO"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="clientscvid"
                        className="form-label"
                      >
                        CLIENTSCVID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="CLIENTSCVID"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="businessstyle"
                        className="form-label"
                      >
                        BUSINESSSTYLE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="businessstyle"
                        placeholder="BUSINESSSTYLE"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="firmid"
                        className="form-label"
                      >
                        FIRMID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="FIRMID"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="created_At"
                        className="form-label"
                      >
                        CREATED_AT
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="created_At"
                        placeholder="CREATED_AT"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="updated_At"
                        className="form-label"
                      >
                        UPDATED_AT
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="UPDATED_AT"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="partnerlawyerno"
                        className="form-label"
                      >
                        PARTNERLAWYERNO
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="partnerlawyerno"
                        placeholder="PARTNERLAWYERNO"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="partnerlawyername"
                        className="form-label"
                      >
                        PARTNERLAWYERNAME
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="PARTNERLAWYERNAME"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="companyclassdese"
                        className="form-label"
                      >
                        COMPANYCLASSDESC
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="companyclassdese"
                        placeholder="COMPANYCLASSDESC"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="clientsvcname"
                        className="form-label"
                      >
                        CLIENTSVCNAME
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="CLIENTSVCNAME"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-6">
                      <label
                        htmlFor="clienttsvctype"
                        className="form-label"
                      >
                        CLIENTSVCTYPE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="clienttsvctype"
                        placeholder="COMPANYCLASSDESC"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-6">
                  {selectedCompany && (
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
                            selectedCompany?.contact?.photo
                              ? `${getImageUrl(
                                selectedCompany?.contact?.photo
                              )}`
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

                <div className="col-span-12">
                  <label htmlFor="basic" className="mt-2 text-[18px]">
                    Contact Information
                  </label>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-6">
                      <label
                        htmlFor="addressline1"
                        className="form-label"
                      >
                        ADDRESSLINE1
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="addressline1"
                        placeholder="ADDRESSLINE1"
                      />
                    </div>
                    <div className="col-span-6">
                      <label
                        htmlFor="addressline2"
                        className="form-label"
                      >
                        ADDRESSLINE2
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="addressline1"
                        placeholder="RETAINERFEE"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-6">
                      <label
                        htmlFor="barangay"
                        className="form-label"
                      >
                        BARANGAY
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="barangay"
                        placeholder="BARANGAY"
                      />
                    </div>
                    <div className="col-span-6">
                      <label
                        htmlFor="town_city"
                        className="form-label"
                      >
                        TOWNCITY
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="town_city"
                        placeholder="TOWNCITY"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-6">
                      <label
                        htmlFor="province_state"
                        className="form-label"
                      >
                        PROVINCE_STATE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="province_state"
                        placeholder="PROVINCE_STATE"
                      />
                    </div>
                    <div className="col-span-6">
                      <label
                        htmlFor="ziocode"
                        className="form-label"
                      >
                        ZIPCODE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="ziocode"
                        placeholder="ZIPCODE"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-6">
                      <label
                        htmlFor="phoneext"
                        className="form-label"
                      >
                        PHONEEXT
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="phoneext"
                        placeholder="PHONEEXT"
                      />
                    </div>
                    <div className="col-span-6">
                      <label
                        htmlFor="phone2"
                        className="form-label"
                      >
                        PHONE2
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone2"
                        placeholder="PHONE2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-6">
                      <label
                        htmlFor="phone2ext"
                        className="form-label"
                      >
                        PHONE2EXT
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone2ext"
                        placeholder="PHONE2EXT"
                      />
                    </div>
                    <div className="col-span-6">
                      <label
                        htmlFor="fax"
                        className="form-label"
                      >
                        FAX
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="fax"
                        placeholder="FAX"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-6">
                      <label
                        htmlFor="phone"
                        className="form-label"
                      >
                        PHONE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        placeholder="PHONE"
                      />
                    </div>
                    <div className="col-span-6">
                      <label
                        htmlFor="email"
                        className="form-label"
                      >
                        EMAIL
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        placeholder="EMAIL"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mb-4">

                    <div className="col-span-6">
                      <label
                        htmlFor="webpage"
                        className="form-label"
                      >
                        WEBPAGE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="webpage"
                        placeholder="WEBPAGE"
                      />
                    </div>
                  </div>


                </div>

                <div className="col-span-6">
                  <label htmlFor="emails" className="form-label">
                    Emails
                  </label>
                  {emails.map((email, index) => (
                    <div key={index} className="flex gap-2 items-center mb-2">
                      <input
                        type="email"
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
                      {index !== 0 && (
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
                  <button
                    type="button"
                    className="mt-4 px-4 py-2 ti-btn bg-primary text-white !font-medium"
                    onClick={() => addField(setEmails, emails)}
                  >
                    + Add Email
                  </button>
                </div>



                {/* Phone Information */}
                <PhoneForm
                  phones={phones}
                  setPhones={setPhones}
                  addField={addField}
                  removeField={removeField}
                />

                {/* Address Information */}
                <AddressForm
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
                Cancel
              </button>
              <button
                type="button"
                className="ti-btn bg-primary text-white !font-medium"
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedCompany}
              >
                {isSubmitting ? (
                  <ButtonSpinner text="Creating Client" />
                ) : (
                  "Create Client"
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateModal;
