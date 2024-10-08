"use client";
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import React, { useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Link from "next/link";

const Select = dynamic(() => import("react-select"), { ssr: false });

const CreateModal = ({ user, roles, fetchUsers }: any) => {
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

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("firstName", data?.firstName);
    formData.append("lastName", data?.lastName);
    formData.append("email", data?.email);
    formData.append("phone", data?.phone);
    formData.append("password", data?.password);
    formData.append("role", data?.role);

    if (selectedImage) {
      formData.append("photo", selectedImage); // Append the photo
    }

    try {
      const res = await userPrivateRequest.post(`/api/users`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for form-data
        },
      });

      toast.success(res.data?.message);
      fetchUsers(); // Refresh the user list
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
        Create User
      </Link>
      <Modal isOpen={modalOpen} close={closeModal}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="max-h-full overflow-hidden ti-modal-content text-balance">
            <div className="ti-modal-header">
              <h6
                className="modal-title text-[1rem] font-semibold text-defaulttextcolor"
                id="mail-ComposeLabel"
              >
                Create User
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
                <div className="xl:col-span-12 col-span-12">
                  <div className="mb-0 text-center">
                    <span className="avatar avatar-xxl avatar-rounded">
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
                      <span className="badge rounded-pill bg-primary avatar-badge">
                        <label
                          htmlFor="profile-change"
                          className="cursor-pointer"
                        >
                          <input
                            type="file"
                            name="photo"
                            className="absolute w-full h-full opacity-0"
                            id="profile-change"
                            onChange={handleFileChange} // Handle file change
                          />
                          <i className="fe fe-camera text-[.625rem] !text-white"></i>
                        </label>
                      </span>
                    </span>
                  </div>
                </div>

                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="first-name" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="first-name"
                    placeholder="First Name"
                    value={data?.firstName || ""}
                    onChange={(e) =>
                      setData({ ...data, firstName: e.target.value })
                    }
                  />
                </div>

                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="last-name" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="last-name"
                    placeholder="Last Name"
                    value={data?.lastName || ""}
                    onChange={(e) =>
                      setData({ ...data, lastName: e.target.value })
                    }
                  />
                </div>

                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="contact-mail" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="contact-mail"
                    placeholder="Enter Email"
                    value={data?.email || ""}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />
                </div>

                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="contact-phone" className="form-label">
                    Phone No
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="contact-phone"
                    placeholder="Enter Phone Number"
                    value={data?.phone || ""}
                    onChange={(e) =>
                      setData({ ...data, phone: e.target.value })
                    }
                  />
                </div>

                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="contact-phone" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="contact-phone"
                    placeholder="Enter Password"
                    value={data?.password || ""}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />
                </div>

                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">Role</label>
                  <Select
                    name="role"
                    options={roles?.map((role) => ({
                      value: role._id,
                      label: role.name,
                    }))}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select Role"
                    onChange={(e: any) => {
                      setData({ ...data, role: e.value });
                    }}
                  />
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
                disabled={isSubmitting} // Disable button when submitting
              >
                {isSubmitting ? (
                  <ButtonSpinner text="Creating User" />
                ) : (
                  "Create User"
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
