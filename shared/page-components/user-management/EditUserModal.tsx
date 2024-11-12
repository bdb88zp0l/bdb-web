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
import { useSelector } from "react-redux";
import TwoFASetupModal from "@/shared/modals/TwoFASetupModal";
import { toWordUpperCase } from "@/utils/utils";

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

  // const handleEdit = () => {
  //   setEdit(!edit);
  // };
  console.log(mode, "mode");
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

  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const handleChangePassword = async (e: React.FormEvent) => {};
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // e.preventDefault();
      setChangePasswordLoading(true);
      const { currentPassword, newPassword, confirmNewPassword } =
        changePasswordData;
      if (newPassword !== confirmNewPassword) {
        toast.error(
          "The new password and confirmation do not match. Please try again."
        );
        return;
      }
      userPrivateRequest
        .post("/api/security/changePassword/" + data?._id, {
          currentPassword,
          newPassword,
          confirmNewPassword,
          sourcePage: "user-management",
        })
        .then((res) => {
          // toast.success("Your password has been changed successfully.");
          setChangePasswordData({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        })
        .finally(() => {
          setChangePasswordLoading(false);
        });
      // Create a FormData object to handle file uploads and other data
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
      <button
        aria-label="button"
        type="button"
        className="ti-btn ti-btn-sm ti-btn-info ti-btn-icon  me-2"
        onClick={openModal}
      >
        <i className="ri-pencil-line"></i>
      </button>
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
                    value={data?.createdAt || ""}
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
                                  defaultChecked={true}
                                  disabled={mode == "show"}
                                  onChange={(e) => {
                                    setIsAuthenticatorModalOpen(true);
                                  }}
                                />
                                {/* onnnn */}
                              </>
                            ) : (
                              <input
                                id="two-step"
                                name="authenticatorOff"
                                type="checkbox"
                                defaultChecked={false}
                                disabled={mode == "show"}
                                onChange={(e) => {
                                  setIsAuthenticatorModalOpen(true);
                                }}
                              />
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
                  {/* <div className="xl:col-span-2 col-span-12"></div> */}

                  {mode == "edit" && (
                    <div className="xl:col-span-6 col-span-12">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[0.875rem] mb-1 font-semibold">
                            Reset Password
                          </p>
                          <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                            Password should be min of{" "}
                            <b className="text-success">
                              8 digits<sup>*</sup>
                            </b>
                            ,atleast{" "}
                            <b className="text-success">
                              One Capital letter<sup>*</sup>
                            </b>{" "}
                            and{" "}
                            <b className="text-success">
                              One Special Character<sup>*</sup>
                            </b>{" "}
                            included.
                          </p>
                          {/* <div className="mb-2">
                            <label
                              htmlFor="current-password"
                              className="form-label"
                            >
                              Current Password
                            </label>
                            <input
                              type="password"
                              className="form-control w-full !rounded-md"
                              id="current-password"
                              placeholder="Current Password"
                              value={changePasswordData.currentPassword}
                              onChange={(e) => {
                                setChangePasswordData({
                                  ...changePasswordData,
                                  currentPassword: e.target.value,
                                });
                              }}
                            />
                          </div> */}
                          <div className="mb-2">
                            <label
                              htmlFor="new-password"
                              className="form-label"
                            >
                              New Password
                            </label>
                            <input
                              type="password"
                              className="form-control w-full !rounded-md"
                              id="new-password"
                              placeholder="New Password"
                              value={changePasswordData.newPassword}
                              onChange={(e) => {
                                setChangePasswordData({
                                  ...changePasswordData,
                                  newPassword: e.target.value,
                                });
                              }}
                            />
                          </div>
                          <div className="mb-0">
                            <label
                              htmlFor="confirm-password"
                              className="form-label"
                            >
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              className="form-control w-full !rounded-md"
                              id="confirm-password"
                              placeholder="Confirm Password"
                              value={changePasswordData.confirmNewPassword}
                              onChange={(e) => {
                                setChangePasswordData({
                                  ...changePasswordData,
                                  confirmNewPassword: e.target.value,
                                });
                              }}
                            />
                          </div>

                          {/* <div className="ltr:float-right rtl:float-left mt-4">
                          <button
                            type="button"
                            className="ti-btn bg-primary text-white"
                            onClick={handleChangePassword}
                          >
                            {changePasswordLoading ? (
                              <ButtonSpinner text="Saving" />
                            ) : (
                              "Save Changes"
                            )}
                          </button>
                        </div> */}
                        </div>
                      </div>
                    </div>
                  )}
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
              {mode == "show" ? (
                <button
                  type="button"
                  className="ti-btn bg-primary text-white !font-medium"
                  data-hs-overlay="#todo-compose"
                  onClick={(e) => {
                    setMode("edit");
                  }}
                >
                  Edit
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
      <TwoFASetupModal
        isOpen={isAuthenticatorModalOpen}
        onClose={() => {
          setIsAuthenticatorModalOpen(false);
        }}
        user={data}
        sourcePage="user-management"
      />
    </>
  );
};

export default EditUserModal;
