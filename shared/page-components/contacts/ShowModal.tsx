"use client";
/**
 * A reusable React component that renders a modal dialog for editing a user.
 *
 * @param {object} props - The component props.
 * @param {object} props.user - The user data to pre-fill the form.
 * @param {array} props.roles - The list of roles available for the user.
 * @param {function} props.fetchContacts - A callback function to refresh the user list.
 * @returns {React.ReactElement} The rendered modal component for editing a user.
 */

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import moment from "moment";
import JsonPreview from "@/shared/common-components/JsonPreview";

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import("react-select"), { ssr: false });

const ShowModal = ({ contact, isShowModalOpen, closeShowModal }: any) => {
  return (
    <>
      <Modal isOpen={isShowModalOpen} close={closeShowModal}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center min-w-[calc(100%-3.5rem)]">
          <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
            <div className="ti-modal-header">
              <h6 className="modal-title text-[1rem] font-semibold text-defaulttextcolor">
                Contact Details
              </h6>
              <button
                type="button"
                className="hs-dropdown-toggle !text-[1rem] !font-semibold !text-defaulttextcolor"
                onClick={closeShowModal}
              >
                <span className="sr-only">Close</span>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="ti-modal-body px-6 py-4 overflow-y-auto">
              <div className="grid grid-cols-12 gap-6">
                {/* Profile Information v1 
                <div className="col-span-12 mb-4">
                  <label htmlFor="basic" className="block font-semibold text-lg">
                    Profile Information
                  </label>
                </div>
                <div className="col-span-6 space-y-2">
                  <div>
                    <label htmlFor="prefix" className="form-label">
                      Title
                    </label>
                    <p>{contact?.title || "N/A"}</p>
                  </div>

                  <div>
                    <label htmlFor="prefix" className="form-label">
                      Prefix
                    </label>
                    <p>{contact?.prefix || "N/A"}</p>
                  </div>

                  <div>
                    <label htmlFor="first-name" className="form-label">
                      First Name
                    </label>
                    <p>{contact?.firstName || "N/A"}</p>
                  </div>

                  <div>
                    <label htmlFor="middle-name" className="form-label">
                      Middle Name
                    </label>
                    <p>{contact?.middleName || "N/A"}</p>
                  </div>

                  <div>
                    <label htmlFor="last-name" className="form-label">
                      Last Name
                    </label>
                    <p>{contact?.lastName || "N/A"}</p>
                  </div>

                  <div>
                    <label htmlFor="suffix" className="form-label">
                      Suffix
                    </label>
                    <p>{contact?.suffix || "N/A"}</p>
                  </div>

                  <div>
                    <label htmlFor="nickname" className="form-label">
                      Nickname
                    </label>
                    <p>{contact?.nickName || "N/A"}</p>
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="form-label">
                      Date of Birth
                    </label>
                    <p>{moment(contact?.dateOfBirth).format("MM/DD/YYYY")}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="text-center flex justify-center items-center flex-col">
                    <span
                      className="avatar avatar-xxl"
                      style={{
                        width: "200px",
                        height: "200px",
                      }}
                    >
                      <img
                        src={
                          contact?.photo
                            ? `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${contact?.photo}`
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
                </div>
                */}

                {/* Profile Information v2 */}
                <div className="col-span-12 mb-4">
                  <label
                    htmlFor="basic"
                    className="block font-semibold text-lg"
                  >
                    Profile Information
                  </label>
                  <div className="grid grid-cols-12 gap-4 mb-6">
                    <div className="col-span-6 space-y-2">
                      <p>
                        <strong>Title:</strong>{" "}
                        {contact?.title || "Information not available"}
                      </p>
                      <p>
                        <strong>Prefix:</strong>{" "}
                        {contact?.prefix || "Information not available"}
                      </p>
                      <p>
                        <strong>First Name:</strong>{" "}
                        {contact?.firstName || "Information not available"}
                      </p>
                      <p>
                        <strong>Middle Name:</strong>{" "}
                        {contact?.middleName || "Information not available"}
                      </p>
                      <p>
                        <strong>Last Name:</strong>{" "}
                        {contact?.lastName || "Information not available"}
                      </p>
                      <p>
                        <strong>Suffix:</strong>{" "}
                        {contact?.suffix || "Information not available"}
                      </p>
                      <p>
                        <strong>Nickname:</strong>{" "}
                        {contact?.nickName || "Information not available"}
                      </p>
                      <p>
                        <strong>Date of Birth:</strong>{" "}
                        {moment(contact?.dateOfBirth).format("MM/DD/YYYY")}
                      </p>
                    </div>

                    <div className="col-span-6 text-center">
                      <span
                        className="avatar avatar-xxl"
                        style={{
                          height: "200px",
                          width: "fit-content",
                        }}
                      >
                        <img
                          src={
                            contact?.photo
                              ? `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${contact?.photo}`
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
                  </div>
                </div>

                {/* Company Information */}
                {contact.companies?.length > 0 && (
                  <>
                    <div className="col-span-12 mb-4">
                      <label
                        htmlFor="basic"
                        className="block font-semibold text-lg"
                      >
                        Company Information
                      </label>
                      {contact.companies.map((company: any, index: number) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-4 mb-6"
                        >
                          <div className="col-span-6 space-y-2">
                            <p>
                              <strong>Company Name:</strong>{" "}
                              {company.companyName ||
                                "Information not available"}
                            </p>
                            <p>
                              <strong>Company Group:</strong>{" "}
                              {company.companyGroup?.name ||
                                "Information not available"}
                            </p>
                            <p>
                              <strong>TIN:</strong>{" "}
                              {company.tin || "Information not available"}
                            </p>
                            <p>
                              <strong>Business Style:</strong>{" "}
                              {company.businessStyle ||
                                "Information not available"}
                            </p>
                            <p>
                              <strong>Supervising Partner:</strong>{" "}
                              {company.supervisingPartner
                                ? `${company.supervisingPartner.firstName} ${company.supervisingPartner.lastName}`
                                : "Information not available"}
                            </p>
                            <p>
                              <strong>Industry:</strong>{" "}
                              {company.industry || "Information not available"}
                            </p>
                            <p>
                              <strong>Referred By:</strong>{" "}
                              {company.referredBy
                                ? `${company.referredBy.firstName} ${company.referredBy.lastName}`
                                : "Information not available"}
                            </p>
                          </div>

                          <div className="col-span-6 text-center">
                            <span
                              className="avatar avatar-xxl"
                              style={{
                                height: "200px",
                                width: "fit-content",
                              }}
                            >
                              <img
                                src={
                                  company?.logo
                                    ? `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${company?.logo}`
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
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Contact Information */}
                <div className="col-span-12 mb-4">
                  <label
                    htmlFor="basic"
                    className="block font-semibold text-lg"
                  >
                    Contact Information
                  </label>
                  <div className="space-y-2">
                    <label className="form-label">Emails</label>
                    {contact.emails?.map((email: any, index: number) => (
                      <p key={index}>{email.value}</p>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="form-label">Phone Numbers</label>
                    {contact.phones?.map((phone: any, index: number) => (
                      <p key={index}>
                        <strong>{phone.label ?? ""}:</strong>{" "}
                        {phone.dialCode || ""} {phone.phoneNumber || ""}
                      </p>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="form-label">Addresses</label>
                    {contact.addresses?.map((address: any, index: number) => (
                      <div key={index}>
                        <p>
                          <strong>{address.label}:</strong>{" "}
                          {`${address.houseNumber || ""}, ${
                            address.street || ""
                          }, ${address.barangay || ""}, ${
                            address.region || ""
                          }, ${address.city || ""}- ${address.zip || ""}, ${
                            address.country || ""
                          }`}
                        </p>
                      </div>
                    ))}
                  </div>

                  <JsonPreview data={contact?.metaData ?? {}} />
                </div>
              </div>
            </div>

            <div className="ti-modal-footer px-6 py-4">
              <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-btn-light align-middle"
                onClick={closeShowModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ShowModal;
