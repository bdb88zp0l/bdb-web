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
import { nodeVisibilityOption, toWordUpperCase } from "@/utils/utils";
const Select = dynamic(() => import("react-select"), { ssr: false });

const AddFolderModal = ({ parentId, fetchNode }: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState<string>("");

  const openModal = (e: any) => {
    e.preventDefault();
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    userPrivateRequest
      .post(`/api/file/createNode`, {
        parentId,
        title,
      })
      .then((res) => {
        setIsSubmitting(false);
        toast.success(res.data?.message);
        fetchNode();
        setTitle("");
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
      <div>
        <Link
          href="#!"
          scroll={false}
          className="hs-dropdown-toggle ti-btn !gap-0 !py-1 !px-2 !text-[0.75rem] !font-medium bg-primary text-white flex items-center justify-center"
          data-hs-overlay="#todo-compose"
          onClick={openModal}
        >
          <i className="ri-add-circle-line align-middle !me-1"></i>
          Create Folder
        </Link>
      </div>

      <Modal isOpen={modalOpen} close={closeModal}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="ti-modal-content w-full">
            <div className="ti-modal-header">
              <h6
                className="modal-title text-[1rem] font-semibold"
                id="mail-ComposeLabel"
              >
                Create Folder
              </h6>
              <button
                type="button"
                className="hs-dropdown-toggle !text-[1rem] !font-semibold !text-defaulttextcolor"
                data-hs-overlay="#todo-compose"
                onClick={closeModal}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="ti-modal-body px-4">
              <div className="col-span-12">
                <label htmlFor="create-folder1" className="form-label">
                  Folder Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="create-folder1"
                  placeholder="Folder Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="ti-modal-footer">
              <button
                type="button"
                className="ti-btn bg-primary text-white !font-medium"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <ButtonSpinner text="Creating Folder" />
                ) : (
                  "Create Folder"
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddFolderModal;
