"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { userPrivateRequest } from "@/config/axios.config";
import Modal from "@/shared/modals/Modal";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useConfig } from "@/shared/providers/ConfigProvider";
import { getImageUrl } from "@/utils/utils";

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import("react-select"), { ssr: false });
const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
});

const CaseTeamOverview = ({
  data,
  pageData,
  fetchData,
  fetchPageData,
}: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmittingMember, setIsSubmittingMember] = useState(false);
  const [addMemberData, setAddMemberData] = useState<any>({});

  const openModal = (e: any) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async () => {
    setIsSubmittingMember(true);

    try {
      let existingTeams = data.teams?.map((team) => {
        return {
          user: team.user._id,
          designation: team.designation._id,
          rate: team.rate,
        };
      });
      existingTeams.push(addMemberData);
      const res = await userPrivateRequest.patch(
        `/api/cases/${data._id}/team`,
        {
          teams: existingTeams,
        }
      );
      toast.success(res.data?.message);
      fetchData(); // Refresh the client list
      setAddMemberData({}); // Reset form
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    } finally {
      setIsSubmittingMember(false);
    }
  };

  const config = useConfig();
  return (
    <>
      <div className="box custom-box">
        <div className="box-header justify-between">
          <div className="box-title">Case Team</div>
          <div>
            <button
              type="button"
              className="ti-btn ti-btn-light !py-1 !px-2 !text-[0.75rem] hs-dropdown-toggle "
              data-hs-overlay="#hs-vertically-centered-modal1"
            >
              <i className="ri-add-line align-middle me-1 font-semibold"></i>
              Add Member
            </button>
            <div
              id="hs-vertically-centered-modal1"
              className="hs-overlay hidden ti-modal"
            >
              <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out min-h-[calc(100%-3.5rem)] flex items-center">
                <div className="ti-modal-content w-full">
                  <div className="ti-modal-header">
                    <h6 className="modal-title" id="staticBackdropLabel2">
                      Add Member
                    </h6>
                    <button
                      type="button"
                      className="hs-dropdown-toggle ti-modal-close-btn"
                      data-hs-overlay="#hs-vertically-centered-modal1"
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="w-3.5 h-3.5"
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="ti-modal-body px-4">
                    <div className="gridgrid-cols-12 gap-4">
                      <div className="xl:col-span-12 col-span-12 mt-2">
                        <label className="form-label">Designation</label>

                        <Select
                          name="user"
                          options={pageData?.designations?.map(
                            (option: any) => {
                              return {
                                value: option._id,
                                label: `${option?.name ?? ""}`,
                              };
                            }
                          )}
                          value={pageData?.designations
                            ?.map((option: any) => {
                              return {
                                value: option._id,
                                label: `${option?.name ?? ""}`,
                              };
                            })
                            ?.find(
                              (option: any) =>
                                option.value === addMemberData?.designation
                            )}
                          className="basic-multi-select"
                          menuPlacement="auto"
                          classNamePrefix="Select2"
                          placeholder="Select Designation"
                          onChange={(e: any) => {
                            setAddMemberData({
                              ...addMemberData,
                              designation: e.value,
                            });
                          }}
                        />
                      </div>
                      <div className="xl:col-span-12 col-span-12 mt-2">
                        <label className="form-label">User</label>

                        <Select
                          name="user"
                          options={pageData?.users?.map((option: any) => {
                            return {
                              value: option._id,
                              label: `${option?.firstName ?? ""}  ${
                                option?.lastName ?? ""
                              }`,
                            };
                          })}
                          value={pageData?.users
                            ?.map((option: any) => {
                              return {
                                value: option._id,
                                label: `${option?.firstName ?? ""}  ${
                                  option?.lastName ?? ""
                                }`,
                              };
                            })
                            ?.find(
                              (option: any) =>
                                option.value === addMemberData?.user
                            )}
                          className="basic-multi-select"
                          menuPlacement="auto"
                          classNamePrefix="Select2"
                          placeholder="Select User"
                          onChange={(e: any) => {
                            setAddMemberData({
                              ...addMemberData,
                              user: e.value,
                            });
                          }}
                        />
                      </div>
                      <div className="xl:col-span-12 col-span-12 mt-2">
                        <label
                          htmlFor="company-lead-score"
                          className="form-label"
                        >
                          Rate{" "}
                          {data.defaultBillingType &&
                            `(${data.defaultBillingType})`}
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="company-lead-score"
                          placeholder="Rate"
                          value={addMemberData?.rate}
                          onChange={(e: any) => {
                            setAddMemberData({
                              ...addMemberData,
                              rate: Number(e.target.value),
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="ti-modal-footer">
                    <button
                      type="button"
                      className="hs-dropdown-toggle ti-btn ti-btn-light"
                      data-hs-overlay="#hs-vertically-centered-modal1"
                    >
                      Cancel
                    </button>
                    <button
                      className="ti-btn ti-btn-primary-full"
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmittingMember}
                    >
                      {isSubmittingMember ? <ButtonSpinner text="" /> : "Add "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box-body !p-0">
          <div className="table-responsive">
            <table className="table whitespace-nowrap min-w-full">
              <thead>
                <tr>
                  <th scope="row" className="text-start">
                    Name
                  </th>
                  <th scope="row" className="text-start">
                    Designation
                  </th>
                  <th scope="row" className="text-start">
                    Rate
                  </th>
                  <th scope="row" className="text-start">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.teams?.map((team, index) => (
                  <tr className="border border-defaultborder">
                    <td>
                      <div className="flex items-center">
                        <div className="me-2 leading-none">
                          <span className="avatar avatar-sm ">
                            <img
                              src={
                                getImageUrl(team.user?.photo) ||
                                "../../../assets/images/faces/2.jpg"
                              }
                              alt=""
                              className="!rounded-full"
                              style={{ objectFit: "cover" }}
                            />
                          </span>
                        </div>
                        <div className="font-semibold">{`${
                          team.user?.firstName ?? ""
                        }  ${team.user?.lastName ?? ""}`}</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-primary/10 text-primary">
                        {team?.designation?.name ?? ""}
                      </span>
                    </td>
                    <td>
                      {team?.rate} {data.currency}
                      <br />
                      <span className="badge bg-primary/10 text-primary">
                        {data.defaultBillingType}
                      </span>
                    </td>
                    <td>
                      <div className="inline-flex">
                        <button
                          aria-label="button"
                          type="button"
                          className="ti-btn ti-btn-sm ti-btn-info me-[0.375rem]"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          aria-label="button"
                          type="button"
                          className="ti-btn ti-btn-sm ti-btn-danger"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseTeamOverview;
