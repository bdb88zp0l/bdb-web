import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), { ssr: false });

const EditModal = ({ team, fetchTeams, pageData }: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>(team); // Fill team info initially
  const [users, setUsers] = useState<any>([]);

  useEffect(() => {
    if (team) {
      // Initialize users based on existing team data
      setUsers(
        team?.users?.map((user: any) => ({
          user: user.user?._id,
          designation: user.designation._id,
          _id: user._id,
        }))
      );
    }
  }, [team]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const res = await userPrivateRequest.patch(`/api/team/${data._id}`, {
        ...data,
        users,
      });
      toast.success(res.data.message);
      fetchTeams(); // Fetch updated teams after edit
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        aria-label="button"
        type="button"
        className="ti-btn ti-btn-sm ti-btn-info ti-btn-icon me-2"
        onClick={openModal}
      >
        <i className="ri-pencil-line"></i>
      </button>

      <Modal isOpen={modalOpen} close={closeModal}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
            <div className="ti-modal-header">
              <h6 className="modal-title text-[1rem] font-semibold text-defaulttextcolor">
                Update Team
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
                <div className="col-span-12">
                  <label htmlFor="first-name" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Title"
                    value={data?.title}
                    onChange={(e) =>
                      setData({ ...data, title: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-12">
                  <label htmlFor="first-name" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    value={data?.description}
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                  />
                </div>

                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="text-area" className="form-label">
                    Teams
                  </label>
                </div>

                {pageData.designations?.map((item: any) => {
                  const selectedUser = users.find(
                    (teamMember: any) => teamMember.designation === item._id
                  );

                  return (
                    <>
                      <div className="col-span-6 content-center">
                        <label htmlFor="input-label2" className="form-label">
                          {item.name}:
                        </label>
                      </div>

                      <div className="col-span-6">
                        <label htmlFor="input-label2" className="form-label">
                          User
                        </label>

                        <Select
                          name="designation"
                          options={pageData?.users?.map((option: any) => ({
                            value: option._id,
                            label: `${option?.firstName ?? ""} ${
                              option?.lastName ?? ""
                            }`,
                          }))}
                          value={
                            selectedUser
                              ? {
                                  value: selectedUser.user,
                                  label: pageData?.users.find(
                                    (user: any) =>
                                      user._id === selectedUser.user
                                  )?.firstName,
                                }
                              : null
                          }
                          className="basic-multi-select"
                          menuPlacement="auto"
                          classNamePrefix="Select2"
                          placeholder="Select User"
                          onChange={(e: any) => {
                            const userIndex = users.findIndex(
                              (obj: any) => obj.designation === item._id
                            );
                            const tempTeams = [...users];
                            if (userIndex === -1) {
                              tempTeams.push({
                                designation: item._id,
                                user: e.value,
                              });
                            } else {
                              tempTeams[userIndex].user = e.value;
                            }
                            setUsers(tempTeams);
                          }}
                        />
                      </div>
                    </>
                  );
                })}
              </div>
            </div>

            <div className="ti-modal-footer">
              <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-btn-light align-middle"
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
                  <ButtonSpinner text="Updating Team" />
                ) : (
                  "Update Team"
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditModal;
