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

import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import TwoFASetupModal from "@/shared/modals/TwoFASetupModal";
import ResetPasswordModal from "@/shared/page-components/user-management/ResetPasswordModal";
import { formatDate, toWordUpperCase } from "@/utils/utils";
import { letterSpacing } from "html2canvas/dist/types/css/property-descriptors/letter-spacing";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import("react-select"), { ssr: false });

const EditUserModal = ({
  user,
  roles,
  fetchUsers,
  showModal,
  setShowModal,
  mode,
  setMode,
}: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>(user);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [resetPasswordShowModal, setResetPasswordShowModal] = useState(false);

  let handlePasswordEdit = () => {
    setResetPasswordShowModal(true);
  };

  useEffect(() => {
    setData(user);
  }, [user]);

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

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const [isAuthenticatorModalOpen, setIsAuthenticatorModalOpen] =
    useState(false);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      if (data?.hourlyRate) {
        formData.append("hourlyRate", data?.hourlyRate);
      }
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

  const auth = useSelector((state: any) => state.auth);

  return (
    <>
      <Modal isOpen={showModal} close={closeModal}>
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
                    disabled={mode == "show"}
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
                    disabled={mode == "show"}
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
                    disabled={mode == "show"}
                  />
                </div>

                {/* <div className="xl:col-span-12 col-span-12">
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
                </div> */}
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="contact-phone" className="form-label">
                    Hourly Rate
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="contact-phone"
                    placeholder="Enter Hourly Rate"
                    value={data?.hourlyRate || ""}
                    onChange={(e) =>
                      setData({ ...data, hourlyRate: e.target.value })
                    }
                    disabled={mode == "show"}
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">Designation</label>
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
                    isDisabled={mode == "show"}
                    onChange={(e: any) => {
                      setData({ ...data, role: e.value });
                    }}
                  />
                </div>
                <div className="form-label">
                  <h4>Security</h4>
                </div>
                <div className="col-span-12">
                  <label className="form-label">Status</label>
                  <Select
                    name="status"
                    options={[
                      { value: "activated", label: "Activated" },
                      { value: "blocked", label: "Blocked" },
                    ]}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select Role"
                    defaultValue={{
                      value: data?.status,
                      label: toWordUpperCase(data?.status),
                    }}
                    isDisabled={mode == "show"}
                    onChange={(e: any) => {
                      setData({ ...data, s: e.value });
                    }}
                  />
                </div>
                <div className="col-span-12">
                  <label htmlFor="contact-phone" className="form-label">
                    Created At
                  </label>
                  <input
                    type="createdat"
                    className="form-control"
                    id="createdat"
                    placeholder="Created At"
                    value={formatDate(data?.createdAt || "")}
                    onChange={(e) =>
                      setData({ ...data, createdAt: e.target.value })
                    }
                    disabled={mode == "show"}
                  />
                </div>

                <div className="col-span-12">
                  <div className="xl:col-span-6 col-span-12">
                    <div className="box  shadow-none mb-0 border dark:border-defaultborder/10">
                      <div className="box-body">
                        <div className="sm:flex block items-center mb-6 justify-between">
                          <div>
                            <p className="text-[0.875rem] mb-1 font-semibold">
                              Two Step Verification
                            </p>
                            <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mb-0">
                              Two step verificatoin is very secured and
                              restricts in happening faulty practices.
                            </p>
                          </div>
                          <div className="custom-toggle-switch sm:ms-2 ms-0">
                            {auth?.user?.googleAuthenticator == "on" ? (
                              <>
                                <input
                                  id="two-step"
                                  name="authenticatorOn"
                                  type="checkbox"
                                  checked={isAuthenticatorModalOpen}
                                  defaultChecked={true}
                                  // disabled={mode == "show"}
                                  onChange={(e) => {
                                    console.log("onChange event check");
                                    setIsAuthenticatorModalOpen(true);
                                  }}
                                />
                              </>
                            ) : (
                              <>
                                <input
                                  id="two-step"
                                  name="authenticatorOff"
                                  type="checkbox"
                                  defaultChecked={false}
                                  // disabled={mode == "show"}
                                  checked={isAuthenticatorModalOpen}
                                  onChange={(e) => {
                                    console.log("onChange event check");
                                    setIsAuthenticatorModalOpen(true);
                                  }}
                                />
                              </>
                            )}
                            <label
                              htmlFor="two-step"
                              className="label-primary mb-1"
                            ></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
              {mode == "edit" && (
                <button
                  type="button"
                  className="ti-btn bg-primary text-white !font-medium"
                  data-hs-overlay="#todo-compose"
                  onClick={handlePasswordEdit}
                >
                  Reset Password
                </button>
              )}

              {mode == "show" ? (
                <button
                  type="button"
                  className="ti-btn bg-primary text-white !font-medium ti-btn-secondary-full btn-wave"
                  data-hs-overlay="#todo-compose"
                  onClick={(e) => {
                    setMode("edit");
                  }}
                >
                  Edit User
                </button>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </Modal>
      {isAuthenticatorModalOpen && (
        <TwoFASetupModal
          isAuthenticatorModalOpen={isAuthenticatorModalOpen}
          setIsAuthenticatorModalOpen={setIsAuthenticatorModalOpen}
          user={data}
          sourcePage="user-management"
        />
      )}

      {resetPasswordShowModal && (
        <ResetPasswordModal
          resetPasswordShowModal={resetPasswordShowModal}
          setResetPasswordShowModal={setResetPasswordShowModal}
          user={data}
        />
      )}
    </>
  );
};

export default EditUserModal;
