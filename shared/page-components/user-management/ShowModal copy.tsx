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

const ShowModal = ({ user }: any) => {
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

  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordLoading(true);
    const { currentPassword, newPassword, confirmNewPassword } =
      changePasswordData;
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    userPrivateRequest
      .post("/api/security/changePassword", {
        currentPassword,
        newPassword,
        confirmNewPassword,
      })
      .then((res) => {
        toast.success("Password changed successfully");
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
  };

  return (
    <>
      <button
        aria-label="button"
        type="button"
        className="ti-btn ti-btn-sm ti-btn-warning ti-btn-icon  me-2"
        data-hs-overlay={"#hs-overlay-contacts"}
        onClick={openModal}
      >
        <i className="ri-eye-line"></i>
      </button>

      {modalOpen && (
        <div
          className="fixed inset-0 w-full "
          style={{
            transition: "opacity 300ms",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999999,
          }}
        >
          <div
            className={`hs-overlay ti-offcanvas ti-offcanvas-right !border-0 ${
              modalOpen
                ? "opacity-100 open opened"
                : "opacity-0 pointer-events-none"
            } !max-w-[25rem]`}
            id={"hs-overlay-contacts"}
            aria-labelledby="offcanvasExample"
          >
            <div className="ti-offcanvas-body !p-0">
              <div className="sm:flex items-start p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10 main-profile-cover">
                <div className="avatar avatar-xxl avatar-rounded online me-4 !bottom-0 !mb-0">
                  <img src="../../../assets/images/faces/4.jpg" alt="" />
                </div>
                <div className="flex-grow main-profile-info">
                  <div className="flex items-center justify-between">
                    <h6 className="font-semibold mb-1 text-white">
                      Lisa Convay
                    </h6>
                    <button
                      type="button"
                      className="ti-btn flex-shrink-0 !p-0  transition-none text-white opacity-70 hover:opacity-100 hover:text-white focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:outline-0 focus-visible:outline-0 !mb-0"
                      data-hs-overlay="#hs-overlay-contacts"
                      onClick={closeModal}
                    >
                      <span className="sr-only">Close modal</span>
                      <i className="ri-close-line leading-none text-lg"></i>
                    </button>
                  </div>
                  <p className="mb-1 text-white  op-7">
                    Chief Executive Officer (C.E.O)
                  </p>
                  <p className="text-[0.75rem] text-white mb-4 opacity-[0.5]">
                    <span className="me-3">
                      <i className="ri-building-line me-1 align-middle"></i>
                      Georgia
                    </span>
                    <span>
                      <i className="ri-map-pin-line me-1 rtl:ms-1 align-middle"></i>
                      Washington D.C
                    </span>
                  </p>
                  <div className="flex mb-0">
                    <div className="me-4">
                      <p className="font-bold text-xl text-white text-shadow mb-0">
                        113
                      </p>
                      <p className="mb-0 text-[0.6875rem] opacity-[0.5] text-white">
                        Deals
                      </p>
                    </div>
                    <div className="me-4">
                      <p className="font-bold text-xl text-white text-shadow mb-0">
                        $12.2k
                      </p>
                      <p className="mb-0 text-[0.6875rem] opacity-[0.5] text-white">
                        Contributions
                      </p>
                    </div>
                    <div className="me-4">
                      <p className="font-bold text-xl text-white text-shadow mb-0">
                        $10.67k
                      </p>
                      <p className="mb-0 text-[0.6875rem] opacity-[0.5] text-white">
                        Comitted
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                <div className="mb-0">
                  <p className="text-[0.9375rem] mb-2 font-semibold">
                    Professional Bio :
                  </p>
                  <p className="text-[#8c9097] dark:text-white/50 op-8 mb-0">
                    I am <b className="text-default">Lisa Convay,</b> here by
                    conclude that,i am the founder and managing director of the
                    prestigeous company name laugh at all and acts as the cheif
                    executieve officer of the company.
                  </p>
                </div>
              </div>
              <div className="p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                <p className="text-[.875rem] mb-2 me-4 font-semibold">
                  Contact Information :
                </p>
                <div className="">
                  <div className="flex items-center mb-2">
                    <div className="me-2">
                      <span className="avatar avatar-sm avatar-rounded bg-light !text-[#8c9097] dark:text-white/50">
                        <i className="ri-mail-line align-middle text-[.875rem]"></i>
                      </span>
                    </div>
                    <div>sonyataylor2531@gmail.com</div>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="me-2">
                      <span className="avatar avatar-sm avatar-rounded bg-light !text-[#8c9097] dark:text-white/50">
                        <i className="ri-phone-line align-middle text-[.875rem]"></i>
                      </span>
                    </div>
                    <div>+(555) 555-1234</div>
                  </div>
                  <div className="flex items-center mb-0">
                    <div className="me-2">
                      <span className="avatar avatar-sm avatar-rounded bg-light !text-[#8c9097] dark:text-white/50">
                        <i className="ri-map-pin-line align-middle text-[.875rem]"></i>
                      </span>
                    </div>
                    <div>
                      MIG-1-11, Monroe Street, Georgetown, Washington D.C,
                      USA,20071
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                <p className="text-[.875rem] mb-0 me-4 font-semibold">
                  Change password :
                </p>

                <div>
                  <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 whitespace-normal">
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
                  <div className="mb-2">
                    <label
                      htmlFor="current-password"
                      className="form-label block"
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
                  </div>
                  <div className="mb-2">
                    <label htmlFor="new-password" className="form-label block">
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
                      className="form-label block"
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

                  <div className="ltr:float-right rtl:float-left mt-4">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowModal;
