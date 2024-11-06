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

const CaseTeamOverview = ({
  data,
  pageData,
  fetchData,
  fetchPageData,
}: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmittingMember, setIsSubmittingMember] = useState(false);
  const [addMemberData, setAddMemberData] = useState<any>({});
  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [editIndex, setEditIndex] = useState<number | null>(null); // Track the index of the team being edited

  const openModal = (e: any, team?: any, index?: number) => {
    e.preventDefault();
    if (team && index !== undefined) {
      setEditMode(true);
      setEditIndex(index);
      setAddMemberData({
        user: team.user._id,
        designation: team.designation._id,
        rate: team.rate,
      });
    } else {
      setEditMode(false);
      setAddMemberData({});
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setAddMemberData({});
    setEditMode(false);
    setEditIndex(null);
  };

  const handleSubmit = async () => {
    setIsSubmittingMember(true);

    try {
      let existingTeams = data?.members
        ? data?.members?.map((team) => ({
            user: team.user._id,
            designation: team.designation._id,
            rate: team.rate,
          }))
        : [];

      if (editMode && editIndex !== null) {
        // Update the team member if in edit mode
        existingTeams[editIndex] = addMemberData;
      } else {
        // Add new member
        existingTeams.push(addMemberData);
      }

      const res = await userPrivateRequest.post(
        `/api/cases/${data?._id}/members`,
        {
          users: existingTeams,
        }
      );
      toast.success(res.data?.message);
      fetchData(); // Refresh the case data
      closeModal();
    } catch (err) {
      console.log(err.message);
      toast.error(err.response?.data?.message || "Error occurred");
    } finally {
      setIsSubmittingMember(false);
    }
  };

  const handleDelete = async (index: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );
    if (!confirmDelete) return;

    try {
      let existingTeams = data?.members
        ? data?.members?.map((team) => ({
            user: team.user._id,
            designation: team.designation._id,
            rate: team.rate,
          }))
        : [];

      // Remove the member at the specific index
      existingTeams.splice(index, 1);

      const res = await userPrivateRequest.post(
        `/api/cases/${data?._id}/members`,
        {
          users: existingTeams,
        }
      );
      toast.success(res.data?.message);
      fetchData(); // Refresh the case data
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    }
  };

  const config = useConfig();
  return (
    <>
      <div className="box custom-box">
        <div className="box-header justify-between">
          <div className="box-title">{data?.team?.title ?? "Team Members"}</div>
          <div>
            <button
              type="button"
              className="ti-btn ti-btn-light !py-1 !px-2 !text-[0.75rem] hs-dropdown-toggle "
              onClick={(e) => openModal(e)}
            >
              <i className="ri-add-line align-middle me-1 font-semibold"></i>
              Add Member
            </button>
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
                {data?.team?.users?.map((team, index) => (
                  <tr key={index} className="border border-defaultborder">
                    <td>
                      <div className="flex items-center">
                        <div className="me-2 leading-none">
                          <span className="avatar avatar-sm ">
                            {team?.user?.photo ? (
                              <img
                                src={
                                  getImageUrl(team.user?.photo) ||
                                  "../../../assets/images/faces/2.jpg"
                                }
                                alt=""
                                className="!rounded-full"
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <i className="ri-account-circle-line me-1 align-middle text-3xl"></i>
                            )}
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
                          onClick={(e) => openModal(e, team, index)}
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          aria-label="button"
                          type="button"
                          className="ti-btn ti-btn-sm ti-btn-danger"
                          onClick={() => handleDelete(index)}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {data?.members?.map((team, index) => (
                  <tr key={index} className="border border-defaultborder">
                    <td>
                      <div className="flex items-center">
                        <div className="me-2 leading-none">
                          <span className="avatar avatar-sm ">
                            {team?.user?.photo ? (
                              <img
                                src={
                                  getImageUrl(team.user?.photo) ||
                                  "../../../assets/images/faces/2.jpg"
                                }
                                alt=""
                                className="!rounded-full"
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <i className="ri-account-circle-line me-1 align-middle text-3xl"></i>
                            )}
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
                          onClick={(e) => openModal(e, team, index)}
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          aria-label="button"
                          type="button"
                          className="ti-btn ti-btn-sm ti-btn-danger"
                          onClick={() => handleDelete(index)}
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

      <Modal isOpen={modalOpen} close={closeModal}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] relative flex items-center">
          <div className="ti-modal-content w-full">
            <div className="ti-modal-header">
              <h6 className="modal-title">
                {editMode ? "Edit Member" : "Add Member"}
              </h6>
              <button
                type="button"
                className="ti-modal-close-btn"
                onClick={closeModal}
              >
                <span className="sr-only">Close</span>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="ti-modal-body px-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <label className="form-label">Designation</label>
                  <Select
                    name="designation"
                    options={pageData?.designations?.map((option: any) => ({
                      value: option._id,
                      label: option?.name,
                    }))}
                    value={pageData?.designations
                      ?.map((option: any) => ({
                        value: option._id,
                        label: option?.name,
                      }))
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

                <div className="col-span-12">
                  <label className="form-label">User</label>
                  <Select
                    name="user"
                    options={pageData?.users?.map((option: any) => ({
                      value: option._id,
                      label: `${option?.firstName ?? ""}  ${
                        option?.lastName ?? ""
                      }`,
                    }))}
                    value={pageData?.users
                      ?.map((option: any) => ({
                        value: option._id,
                        label: `${option?.firstName ?? ""}  ${
                          option?.lastName ?? ""
                        }`,
                      }))
                      ?.find(
                        (option: any) => option.value === addMemberData?.user
                      )}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select User"
                    onChange={(e: any) => {
                      let selectedUserInfo = pageData?.users?.find(
                        (option: any) => option._id === e.value
                      );

                      console.log("selectedUserInfo", selectedUserInfo);
                      setAddMemberData({
                        ...addMemberData,
                        user: e.value,
                        rate: selectedUserInfo?.hourlyRate ?? 0,
                      });
                    }}
                  />
                </div>

                <div className="col-span-12">
                  <label className="form-label">
                    Rate ({data.defaultBillingType ?? ""})
                  </label>
                  <input
                    type="number"
                    className="form-control"
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
                className="ti-btn ti-btn-light"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="ti-btn ti-btn-primary-full"
                type="button"
                onClick={handleSubmit}
                disabled={isSubmittingMember}
              >
                {isSubmittingMember ? (
                  <ButtonSpinner text="" />
                ) : editMode ? (
                  "Update"
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CaseTeamOverview;
