"use client";
import { userPrivateRequest } from "@/config/axios.config";
import {
  Accountoptions,
  Countryoptions,
  Languageoptions,
  Mailsettingslist,
  MaxLimitoptions,
  Maximumoptions,
  ProfileService,
} from "@/shared/data/pages/mail/mailsettingdata";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import TwoFASetupModal from "@/shared/modals/TwoFASetupModal";
import { getImageUrl } from "@/utils/utils";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const Select = dynamic(() => import("react-select"), { ssr: false });

const Mailsettings = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Handle file change and update preview image
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const auth = useSelector((state: any) => state.auth);

  const [isAuthenticatorModalOpen, setIsAuthenticatorModalOpen] =
    useState(false);

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
      toast.error(
        "The new password and confirmation do not match. Please try again."
      );
      return;
    }
    userPrivateRequest
      .post("/api/security/changePassword", {
        currentPassword,
        newPassword,
        confirmNewPassword,
        sourcePage: "profile",
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
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setChangePasswordLoading(false);
      });
  };

  // Code to update profile
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  useEffect(() => {
    setProfileData({
      firstName: auth?.user?.firstName,
      lastName: auth?.user?.lastName,
      email: auth?.user?.email,
    });
    if (auth?.user?.photo) {
      setPreviewImage(getImageUrl(auth?.user?.photo ?? ""));
    }
  }, [auth?.user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // return;
    setIsSubmitting(true);
    // Code to update profile

    const formData = new FormData();
    formData.append("firstName", profileData.firstName);
    formData.append("lastName", profileData.lastName);

    // Append the image file if it has been selected
    if (selectedImage) {
      console.log("first", selectedImage);
      formData.append("photo", selectedImage);
    }

    userPrivateRequest
      .post("/api/profile/updateProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success("Your profile has been updated successfully.");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Fragment>
      <Seo title={"Profile Settings"} />
      <Pageheader
        currentpage="Settings"
        activepage="Profile"
        mainpage="Settings"
      />

      {/* Modal */}

      <TwoFASetupModal
        isOpen={isAuthenticatorModalOpen}
        onClose={() => {
          setIsAuthenticatorModalOpen(false);
        }}
        user={auth?.user}
        sourcePage="profile"
      />
      {/* Modal end */}
      <div className="container">
        <div className="grid grid-cols-12 gap-6 mb-[3rem]">
          <div className="xl:col-span-12 col-span-12">
            <div className="box">
              {/* <div className="box-header sm:flex block !justify-start">
                <nav
                  aria-label="Tabs"
                  className="md:flex block !justify-start whitespace-nowrap"
                  role="tablist"
                >
                  <Link
                    href="#!"
                    scroll={false}
                    className="m-1 block w-full hs-tab-active:bg-primary/10 hs-tab-active:text-primary cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow  text-[0.75rem] font-medium rounded-md hover:text-primary active"
                    id="Personal-item"
                    data-hs-tab="#personal-info"
                    aria-controls="#personal-info"
                  >
                    Personal Information
                  </Link>
                  <Link
                    href="#!"
                    scroll={false}
                    className="m-1 block w-full hs-tab-active:bg-primary/10 hs-tab-active:text-primary cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 text-[0.75rem] flex-grow font-medium rounded-md hover:text-primary "
                    id="account-item"
                    data-hs-tab="#account-settings"
                    aria-controls="account-settings"
                  >
                    Security Settings
                  </Link>
                </nav>
              </div> */}
              <div className="box-body">
                <div className="tab-content">
                  <div
                    className="tab-pane show active dark:border-defaultborder/10"
                    id="personal-info"
                    aria-labelledby="Personal-item"
                  >
                    <div className="sm:p-4 p-0">
                      <h6 className="font-semibold mb-4 text-[1rem]">
                        Photo :
                      </h6>
                      <div className="mb-6 sm:flex items-center">
                        <div className="mb-0 me-[3rem]">
                          <span className="avatar avatar-xxl avatar-rounded">
                            {previewImage ? (
                              <img
                                src={previewImage ? previewImage : ""}
                                alt=""
                                id="profile-img"
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <i className="ri-account-circle-line me-1 align-middle text-8xl"></i>
                            )}
                            <span
                              aria-label="anchor"
                              className="badge rounded-full bg-primary avatar-badge"
                              onClick={openFileInput}
                            >
                              <input
                                type="file"
                                name="photo"
                                data-hs-overlay="#hs-small-modal"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                                className="absolute w-full h-full opacity-0"
                                id="profile-image"
                              />
                              <i className="fe fe-camera !text-[0.65rem] !text-white"></i>
                            </span>
                          </span>
                        </div>
                        <div className="inline-flex">
                          {/* <button
                            type="button"
                            className="ti-btn bg-primary text-white !rounded-e-none !font-medium"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            className="ti-btn ti-btn-light !font-medium !rounded-s-none"
                          >
                            Remove
                          </button> */}
                        </div>
                      </div>
                      <h6 className="font-semibold mb-4 text-[1rem]">
                        Profile :
                      </h6>
                      <div className="sm:grid grid-cols-12 gap-6 mb-6">
                        <div className="xl:col-span-6 col-span-12">
                          <label htmlFor="first-name" className="form-label">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="form-control w-full !rounded-md"
                            id="first-name"
                            placeholder="First Name"
                            value={profileData?.firstName}
                            onChange={(e) => {
                              setProfileData({
                                ...profileData,
                                firstName: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className="xl:col-span-6 col-span-12">
                          <label htmlFor="last-name" className="form-label">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="form-control w-full !rounded-md"
                            id="last-name"
                            placeholder="Last Name"
                            value={profileData?.lastName}
                            onChange={(e) => {
                              setProfileData({
                                ...profileData,
                                lastName: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <h6 className="font-semibold mb-4 text-[1rem]">
                        Personal information :
                      </h6>
                      <div className="sm:grid grid-cols-12 gap-6 mb-6">
                        <div className="xl:col-span-6 col-span-12">
                          <label htmlFor="email-address" className="form-label">
                            Email Address :
                          </label>
                          <input
                            type="text"
                            className="form-control w-full !rounded-md"
                            id="email-address"
                            placeholder="xyz@gmail.com"
                            value={auth?.user?.email}
                            disabled={true}
                          />
                        </div>
                        {/* <div className="xl:col-span-6 col-span-12">
                          <label
                            htmlFor="Contact-Details"
                            className="form-label"
                          >
                            Contact Details :
                          </label>
                          <input
                            type="text"
                            className="form-control w-full !rounded-md"
                            id="Contact-Details"
                            placeholder="contact details"
                          />
                        </div>
                        <div className="xl:col-span-6 col-span-12">
                          <label className="form-label">Language :</label>
                          <Select
                            isMulti
                            name="colors"
                            options={Languageoptions}
                            className=""
                            menuPlacement="auto"
                            classNamePrefix="Select2"
                            defaultValue={[Languageoptions[0]]}
                          />
                        </div>
                        <div className="xl:col-span-6 col-span-12">
                          <label className="form-label">Country :</label>
                          <Select
                            name="colors"
                            options={Countryoptions}
                            className="w-full !rounded-md"
                            menuPlacement="auto"
                            classNamePrefix="Select2"
                            defaultValue={[Countryoptions[0]]}
                          />
                        </div>
                        <div className="xl:col-span-12 col-span-12">
                          <label htmlFor="bio" className="form-label">
                            Bio :
                          </label>
                          <textarea
                            className="form-control w-full !rounded-md dark:!text-defaulttextcolor/70"
                            id="bio"
                            rows={5}
                            defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. At sit impedit, officiis non minima saepe voluptates a magnam enim sequi porro veniam ea suscipit dolorum vel mollitia voluptate iste nemo!"
                          />
                        </div> */}
                      </div>
                      <div className="text-end">
                        <button
                          type="button"
                          className="ti-btn bg-primary text-white"
                          onClick={handleProfileUpdate}
                        >
                          {isSubmitting ? (
                            <ButtonSpinner text="Saving" />
                          ) : (
                            "Save Changes"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane dark:border-defaultborder/10 hidden"
                    id="account-settings"
                    aria-labelledby="account-item"
                    role="tabpanel"
                  >
                    <div className="grid grid-cols-12 gap-4">
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
                            <div className="mb-2">
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
                            </div>
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
                </div>
              </div>
              {/* <div className="box-footer">
                <div className="ltr:float-right rtl:float-left">
                  <button
                    type="button"
                    className="ti-btn bg-primary text-white m-1"
                  >
                    Save Changes
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Mailsettings;
