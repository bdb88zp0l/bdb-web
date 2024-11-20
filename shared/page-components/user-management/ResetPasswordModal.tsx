"use client";
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";

import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "react-toastify";

const Select = dynamic(() => import("react-select"), { ssr: false });

const ResetPasswordModal = ({
  resetPasswordShowModal,
  setResetPasswordShowModal,
  user,
}: any) => {
  const [data, setData] = useState<any>(user);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const openModal = () => setResetPasswordShowModal(true);
  const closeModal = () => setResetPasswordShowModal(false);
  console.log("changepassword", changePasswordLoading);
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const handleSubmit = async () => {
    try {
      // e.preventDefault();
      setChangePasswordLoading(true);
      const { currentPassword, newPassword, confirmNewPassword } =
        changePasswordData;
      if (newPassword !== confirmNewPassword) {
        toast.error(
          "The new password and confirmation do not match. Please try again."
        );
        setChangePasswordLoading(true);
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
          toast.success("Your password has been changed successfully.");
          setChangePasswordData({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
        })
        .catch((err) => {
          toast.error(err.response.data.message || "Error occurred");
        })
        .finally(() => {
          setChangePasswordLoading(false);

          setResetPasswordShowModal(false);
        });
    } catch (error) {
      toast.error("An error occurred while changing the password.");
      setChangePasswordLoading(false);
    }
  };

  return (
    <Modal
      isOpen={resetPasswordShowModal}
      close={() => {
        setResetPasswordShowModal;
      }}
    >
      <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
        <div className="max-h-full w-full overflow-hidden ti-modal-content">
          <div className="ti-modal-header">
            <h6 className="modal-title text-[1rem] font-semibold text-defaulttextcolor">
              Reset Password
            </h6>
            <button
              type="button"
              className="hs-dropdown-toggle !text-[1rem] !font-semibold !text-defaulttextcolor"
              onClick={() => {
                closeModal();
              }}
            >
              <span className="sr-only">Close</span>
              <i className="ri-close-line"></i>
            </button>
          </div>

          <div className="ti-modal-body px-4 overflow-y-auto">
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
                    <label htmlFor="current-password" className="form-label">
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
                    <label htmlFor="new-password" className="form-label">
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
                    <label htmlFor="confirm-password" className="form-label">
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
                </div>
              </div>
            </div>
          </div>

          <div className="ti-modal-footer">
            <button
              type="button"
              className="hs-dropdown-toggle ti-btn ti-btn-light align-middle"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="ti-btn bg-primary text-white"
              onClick={handleSubmit}
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
    </Modal>
  );
};

export default ResetPasswordModal;
