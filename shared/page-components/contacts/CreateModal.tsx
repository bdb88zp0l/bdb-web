"use client";
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import React, { useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Link from "next/link";
import DatePicker from "react-datepicker";
import CompanyForm from "./components/CompanyForm";
import PhoneForm from "./components/PhoneForm";
import AddressForm from "./components/AddressForm";
import moment from "moment";

const Select = dynamic(() => import("react-select"), { ssr: false });

const CreateModal = ({
  user,
  roles,
  fetchContacts,
  pageData,
  fetchPageData,
}: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>(user);
  const [selectedImage, setSelectedImage] = useState<any>(null); // Store image file
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Preview the image

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
  const [companies, setCompanies] = useState([
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
  ]);

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
      const res = await userPrivateRequest.post(`/api/contacts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for form-data
        },
      });

      toast.success(res.data?.message);
      fetchContacts(); // Refresh the user list
      setData({}); // Reset form
      closeModal(); // Close modal
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Link
        href="#!"
        scroll={false}
        className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem] me-2"
        onClick={openModal}
      >
        <i className="ri-add-line font-semibold align-middle"></i>
        Create Contact
      </Link>
      <Modal isOpen={modalOpen} close={closeModal}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center  min-w-[calc(100%-3.5rem)]">
          <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
            <div className="ti-modal-header">
              <h6
                className="modal-title text-[1rem] font-semibold text-defaulttextcolor"
                id="mail-ComposeLabel"
              >
                Create Contact
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
                <div className="col-span-12">
                  <label htmlFor="basic" className="mt-2 text-[18px]">
                    Profile Information
                  </label>
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
                      selected={moment(data?.dateOfBirth).toDate()}
                      onChange={(date) =>
                        setData({
                          ...data,
                          dateOfBirth: date,
                        })
                      }
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
                            className="cursor-pointer flex justify-center items-center" // আইকন সেন্টার করার জন্য
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ButtonSpinner text="Creating Contact" />
                ) : (
                  "Create Contact"
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
