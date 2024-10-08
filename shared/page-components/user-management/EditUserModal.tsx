"use client";
/**
 * A reusable React component that renders a modal dialog for editing a user.
 *
 * @param {object} props - The component props.
 * @param {object} props.user - The user data to pre-fill the form.
 * @param {array} props.roles - The list of roles available for the user.
 * @param {function} props.fetchUsers - A callback function to refresh the user list.
 * @returns {React.ReactElement} The rendered modal component for editing a user.
 */

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import("react-select"), { ssr: false });

const EditUserModal = ({ user, roles, fetchUsers }: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>(user);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Handle file change and update preview image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Generate preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Create a FormData object to handle file uploads and other data
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append(
        "role",
        typeof data.role === "object" ? data.role._id : data.role
      );

      // Append the image file if it has been selected
      if (selectedImage) {
        formData.append("photo", selectedImage);
      }

      // Send the form data to the server using PATCH request
      const response = await userPrivateRequest.patch(
        `/api/users/${data._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      fetchUsers(); // Refresh the user list after successful update
      closeModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        aria-label="button"
        type="button"
        className="ti-btn ti-btn-sm ti-btn-info ti-btn-icon  me-2"
        onClick={openModal}
      >
        <i className="ri-pencil-line"></i>
      </button>
      <Modal isOpen={modalOpen} close={closeModal}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
            <div className="ti-modal-header">
              <h6
                className="modal-title text-[1rem] font-semibold text-defaulttextcolor"
                id="mail-ComposeLabel"
              >
                Update User
              </h6>
              <button
                type="button"
                className="hs-dropdown-toggle !text-[1rem] !font-semibold !text-defaulttextcolor"
                data-hs-overlay="#todo-compose"
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
                          previewImage
                            ? previewImage
                            : `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${data?.photo}`
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
                    defaultValue={{
                      value: data?.role?._id,
                      label: data?.role?.name,
                    }}
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
                data-hs-overlay="#todo-compose"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ti-btn bg-primary text-white !font-medium"
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <ButtonSpinner text="Updating User" />
                ) : (
                  "Update User"
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditUserModal;
