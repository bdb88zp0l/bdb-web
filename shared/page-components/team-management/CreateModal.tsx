/**
 * A reusable React component that renders a modal dialog.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Indicates whether the modal should be open or closed.
 * @param {function} props.close - A callback function to close the modal.
 * @param {React.ReactNode} props.children - The content to be displayed inside the modal.
 * @returns {React.ReactElement} The rendered modal component.
 */
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Link from "next/link";
const Select = dynamic(() => import("react-select"), { ssr: false });

const CreateModal = ({ fetchTeams, pageData }: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>({});

  const [users, setUsers] = useState<any>([]);

  const openModal = (e: any) => {
    e.preventDefault();
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    userPrivateRequest
      .post(`/api/team`, { ...data, users })
      .then((res) => {
        setIsSubmitting(false);
        toast.success(res.data?.message);
        fetchTeams();
        setData({});
        closeModal();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <Link
        href="#!"
        scroll={false}
        className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem] me-2"
        onClick={openModal}
      >
        <i className="ri-add-line font-semibold align-middle"></i>
        Create Team
      </Link>
      <Modal isOpen={modalOpen} close={closeModal}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
            <div className="ti-modal-header">
              <h6
                className="modal-title text-[1rem] font-semibold text-defaulttextcolor"
                id="mail-ComposeLabel"
              >
                Create Team
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
                    id="first-name"
                    placeholder="Title"
                    value={data?.title}
                    onChange={(e) => {
                      e.preventDefault();
                      setData({
                        ...data,
                        title: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="col-span-12">
                  <label htmlFor="first-name" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="first-name"
                    placeholder="Description"
                    value={data?.description}
                    onChange={(e) => {
                      e.preventDefault();
                      setData({
                        ...data,
                        description: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="text-area" className="form-label">
                    Teams
                  </label>
                </div>
                {pageData.designations?.map((item: any) => {
                  return (
                    <>
                      <div className=" col-span-4 content-center">
                        <label htmlFor="input-label2" className="form-label">
                          {item.name}:
                        </label>
                      </div>
                      <div className=" col-span-4">
                        <label htmlFor="input-label2" className="form-label">
                          User
                        </label>
                        <Select
                          name="designation"
                          options={pageData?.users?.map((option: any) => {
                            return {
                              value: option._id,
                              label: `${option?.firstName ?? ""}  ${
                                option?.lastName ?? ""
                              }`,
                            };
                          })}
                          className="basic-multi-select"
                          menuPlacement="auto"
                          classNamePrefix="Select2"
                          placeholder="Select User"
                          onChange={(e: any) => {
                            let ss = users.findIndex(
                              (obj: any) => obj.designation === item._id
                            );
                            let temporaryTeams = users;
                            if (ss == -1) {
                              setUsers([
                                ...temporaryTeams,
                                {
                                  designation: item._id,
                                  user: e.value,
                                },
                              ]);
                            } else {
                              temporaryTeams[ss].user = e.value;
                              setUsers([...temporaryTeams]);
                            }
                          }}
                        />
                      </div>

                      <div className=" col-span-4">
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
                          onChange={(e: any) => {
                            let ss = users.findIndex(
                              (obj: any) => obj.designation === item._id
                            );
                            let temporaryTeams = users;
                            if (ss == -1) {
                              setUsers([
                                ...temporaryTeams,
                                {
                                  designation: item._id,
                                  rate: e.target.value,
                                },
                              ]);
                            } else {
                              temporaryTeams[ss].rate = e.target.value;
                              setUsers([...temporaryTeams]);
                            }
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
                  <ButtonSpinner text="Creating Team" />
                ) : (
                  "Create Team"
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateModal;
