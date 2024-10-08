import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Link from "next/link";
const Select = dynamic(() => import("react-select"), { ssr: false });

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { nodeVisibilityOption, toWordUpperCase } from "@/utils/utils";

// Register the file type validation plugin
registerPlugin(FilePondPluginFileValidateType);
const AddFileModal = ({ parentId, fetchNode, users }: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<any>();
  const [visibility, setVisibility] = useState<string>("inherit");

  const openModal = (e: any) => {
    e.preventDefault();
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();

    // Add uploaded files to FormData
    files?.forEach((fileItem: any) => {
      if (fileItem.file) {
        formData.append("files", fileItem.file);
      }
    });
    formData.append("parentId", parentId);
    formData.append("visibility", visibility);

    userPrivateRequest
      .post(`/api/file/documents/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setIsSubmitting(false);
        toast.success(res.data?.message);
        fetchNode();
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
          className="hs-dropdown-toggle ti-btn !gap-0 !py-1 !px-2 !text-[0.75rem] !font-medium bg-secondary text-white flex items-center justify-center"
          onClick={openModal}
        >
          <i className="ri-add-circle-line align-middle !me-1"></i>
          Create File
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
                Create File
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
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 hidden">
                  <label className="form-label">Visibility</label>
                  <Select
                    name="role"
                    options={nodeVisibilityOption?.map((option) => ({
                      value: option,
                      label: toWordUpperCase(option),
                    }))}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select visibility"
                    onChange={(e: any) => {
                      setVisibility(e.value);
                    }}
                  />
                </div>

                {/* {visibility == "protected" && (
                  <div className="col-span-12">
                    <label className="form-label">People with access</label>
                    <Select
                      isMulti
                      name="state"
                      options={users?.map((user: any) => {
                        return {
                          value: user._id,
                          label: `${user?.firstName ?? ""}  ${
                            user?.lastName ?? ""
                          }`,
                        };
                      })}
                      className="js-example-placeholder-multiple w-full js-states"
                      menuPlacement="auto"
                      classNamePrefix="Select2"
                      // defaultValue={[Selectoption4[0]]}
                      placeholder={"Select people"}
                      onChange={(e: any) => {
                        setPermittedUserIds(
                          e?.map((i: { value: string; label: string }) => {
                            return i.value;
                          })
                        );
                      }}
                    />
                  </div>
                )} */}
                <div className="col-span-12">
                  <FilePond
                    files={files}
                    onupdatefiles={setFiles} // Update files state when files are added/removed
                    allowMultiple={true}
                    maxFiles={5}
                    name="files"
                    acceptedFileTypes={["application/pdf"]}
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                  />
                </div>
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
                  <ButtonSpinner text="Creating File" />
                ) : (
                  "Create File"
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddFileModal;
