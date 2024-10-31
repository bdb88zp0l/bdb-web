"use client";
import { userPrivateRequest } from "@/config/axios.config";
import JsonPreview from "@/shared/common-components/JsonPreview";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import moment from "moment";
import dynamic from "next/dynamic";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import AddressForm from "./components/AddressForm";
import CompanyForm from "./components/CompanyForm";
import PhoneForm from "./components/PhoneForm";

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import("react-select"), { ssr: false });

const UpdateModal = ({
  contact, // Contact data to update
  fetchContacts,
  pageData,
  fetchPageData,
  isEditModalOpen,
  setIsEditModalOpen,
}: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState<any>(contact); // Prefill with saved contact data
  const [selectedImage, setSelectedImage] = useState<any>(null); // Store image file
  const [previewImage, setPreviewImage] = useState<string | null>(
    contact?.photo
      ? `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${contact?.photo}`
      : null // Prefill with the contact's photo
  );

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Set the file
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (e: any) => {
    e.preventDefault();
    setIsEditModalOpen(true);
  };

  const closeModal = () => setIsEditModalOpen(false);

  // State to manage multiple emails, phones, addresses, and companies
  const [emails, setEmails] = useState(
    contact.emails || [{ value: "" }] // Prefill with saved emails
  );
  const [phones, setPhones] = useState(
    contact.phones || [{ dialCode: "", phoneNumber: "", label: "" }] // Prefill with saved phones
  );
  const [addresses, setAddresses] = useState(
    contact.addresses || [
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
    ] // Prefill with saved addresses
  );
  const [companies, setCompanies] = useState(
    contact.companies || [
      {
        companyName: "",
        companyGroup: "",
        tin: "",
        businessStyle: "",
        supervisingPartner: "",
        industry: "",
        referredBy: "",
        logo: null,
      },
    ] // Prefill with saved companies
  );

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

  const handleCompanyLogoChange = (index: number, e: any) => {
    const file = e.target.files[0];
    const updatedCompanies = [...companies];
    updatedCompanies[index].logo = file;
    setCompanies(updatedCompanies);
  };

  const addField = (setter: any, field: any[]) => {
    setter([
      ...field,
      {
        value: "",
      },
    ]);
  };

  const removeField = (setter: any, field: any[], index: number) => {
    const newField = [...field];
    newField.splice(index, 1);
    setter(newField);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", data?.title);
    formData.append("suffix", data?.suffix);
    formData.append("prefix", data?.prefix);
    formData.append("dateOfBirth", data?.dateOfBirth);
    formData.append("firstName", data?.firstName);
    formData.append("middleName", data?.middleName);
    formData.append("lastName", data?.lastName);
    formData.append("nickName", data?.nickName);
    formData.append("addresses", JSON.stringify(addresses));
    formData.append("emails", JSON.stringify(emails));
    formData.append("phones", JSON.stringify(phones));
    formData.append("companies", JSON.stringify(companies));

    if (selectedImage) {
      formData.append("photo", selectedImage); // Append the photo
    }

    try {
      const res = await userPrivateRequest.patch(
        `/api/contacts/${contact._id}`, // Use PUT to update the contact
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for form-data
          },
        }
      );

      toast.success(res.data?.message);
      fetchContacts(); // Refresh the user list
      closeModal(); // Close modal
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDisabled = () => {
    setIsDisabled(!isDisabled);
  };

  return (
    <>
      {/* <button
        aria-label="button"xes
        type="button"
        className="ti-btn ti-btn-sm ti-btn-info ti-btn-icon  me-2"
        onClick={openModal}
      >
        <i className="ri-pencil-line"></i>
      </button> */}
      <Modal isOpen={isEditModalOpen} close={closeModal}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center  min-w-[calc(100%-3.5rem)]">
          <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
            <div className="ti-modal-header">
              <div className="flex gap-2.5 items-center">
                <h6
                  className="modal-title text-[1rem] font-semibold text-defaulttextcolor"
                  id="mail-ComposeLabel"
                >
                  Update Contact
                </h6>
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
                <div className="col-span-12 flex items-center gap-2">
                  <h6
                    className="modal-title text-[1rem] font-semibold text-defaulttextcolor"
                    id="mail-ComposeLabel"
                  >
                    Profile Information
                  </h6>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <div className="xl:col-span-6 col-span-12">
                    <label htmlFor="prefix" className="form-label mt-2">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id=""
                      placeholder="Title"
                      value={data?.title || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          title: e.target.value,
                        })
                      }
                      disabled={isDisabled}
                    />
                  </div>

                  <div className="xl:col-span-6 col-span-12">
                    <label htmlFor="prefix" className="form-label mt-2">
                      Prefix
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id=""
                      placeholder="Prefix"
                      value={data?.prefix || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          prefix: e.target.value,
                        })
                      }
                      disabled={isDisabled}
                    />
                  </div>

                  <div className="xl:col-span-6 col-span-12">
                    <label htmlFor="first-name" className="form-label mt-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first-name"
                      placeholder="First Name"
                      value={data?.firstName || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          firstName: e.target.value,
                        })
                      }
                      disabled={isDisabled}
                    />
                  </div>

                  <div className="xl:col-span-6 col-span-12">
                    <label htmlFor="last-name" className="form-label mt-2">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last-name"
                      placeholder="Middle Name"
                      value={data?.middleName || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          middleName: e.target.value,
                        })
                      }
                      disabled={isDisabled}
                    />
                  </div>

                  <div className="xl:col-span-6 col-span-12">
                    <label htmlFor="last-name" className="form-label mt-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last-name"
                      placeholder="Last Name"
                      value={data?.lastName || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          lastName: e.target.value,
                        })
                      }
                      disabled={isDisabled}
                    />
                  </div>
                  <div className="xl:col-span-6 col-span-12">
                    <label htmlFor="prefix" className="form-label mt-2">
                      Suffix
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id=""
                      placeholder="Prefix"
                      value={data?.suffix || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          suffix: e.target.value,
                        })
                      }
                      disabled={isDisabled}
                    />
                  </div>
                  <div className="xl:col-span-6 col-span-12">
                    <div className="xl:col-span-6 col-span-12">
                      <label htmlFor="nickname" className="form-label mt-2">
                        Nickname
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nickname"
                        placeholder="Nickname"
                        value={data?.nickName || ""}
                        onChange={(e) =>
                          setData({
                            ...data,
                            nickName: e.target.value,
                          })
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                  <div className="xl:col-span-12 col-span-12">
                    <label htmlFor="contact-mail" className="form-label mt-2">
                      Date of Birth
                    </label>

                    <DatePicker
                      className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                      showIcon
                      selected={
                        data?.dateOfBirth
                          ? moment(data?.dateOfBirth).toDate()
                          : null
                      }
                      onChange={(date) =>
                        setData({
                          ...data,
                          dateOfBirth: date,
                        })
                      }
                      disabled={isDisabled}
                    />
                  </div>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <div className="xl:col-span-12 col-span-12">
                    <div className="pt-36 text-center flex justify-center items-center flex-col">
                      {" "}
                      <span
                        className="avatar avatar-xxl"
                        style={{
                          width: "200px",
                          height: "200px",
                        }}
                      >
                        {" "}
                        <img
                          src={
                            previewImage || "../../../assets/images/faces/9.jpg"
                          }
                          alt=""
                          id="profile-img"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <span className="badge rounded-pill bg-primary avatar-badge absolute bottom-0 right-0">
                          {" "}
                          <label
                            htmlFor="profile-change"
                            className="cursor-pointer flex justify-center items-center"
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                          >
                            <input
                              type="file"
                              name="photo"
                              className="absolute w-full h-full opacity-0"
                              id="profile-change"
                              onChange={handleFileChange}
                              disabled={isDisabled}
                            />
                            <i className="fe fe-camera text-[1.25rem] !text-white"></i>{" "}
                          </label>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Company Information */}

                <CompanyForm
                  companies={companies}
                  setCompanies={setCompanies}
                  addField={addField}
                  removeField={removeField}
                  pageData={pageData}
                  fetchPageData={fetchPageData}
                  isDisabled={isDisabled}
                />

                <div className="col-span-12">
                  <label htmlFor="basic" className="mt-2 text-[18px]">
                    Contact Information
                  </label>
                </div>
                {/* Emails */}
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
                        disabled={isDisabled}
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
                  {!isDisabled && (
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 ti-btn bg-primary text-white !font-medium"
                      onClick={() => addField(setEmails, emails)}
                      disabled={isDisabled}
                    >
                      + Add Email
                    </button>
                  )}
                </div>

                {/* Phone Information */}
                <PhoneForm
                  phones={phones}
                  setPhones={setPhones}
                  addField={addField}
                  removeField={removeField}
                  isDisabled={isDisabled}
                />

                {/* Address Information */}
                <AddressForm
                  addresses={addresses}
                  setAddresses={setAddresses}
                  addField={addField}
                  removeField={removeField}
                  isDisabled={isDisabled}
                />

                {Object.keys(contact?.metaData ?? {}).length > 0 && (
                  <div className="col-span-12">
                    <JsonPreview data={contact?.metaData ?? {}} />
                  </div>
                )}
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

              {!isDisabled ? (
                <button
                  type="button"
                  className="ti-btn bg-primary text-white !font-medium"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ButtonSpinner text="Updating Contact" />
                  ) : (
                    "Update Contact"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  className="ti-btn bg-primary text-white !font-medium ti-btn-secondary-full btn-wave"
                  onClick={toggleDisabled}
                >
                  Edit Contact
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
