"use client";
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import moment from "moment";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

const Select = dynamic(() => import("react-select"), { ssr: false });

const CreateModal = ({
  user,
  roles,
  fetchUsers,
  ModalOpen,
  CloseModal,
}: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>(user);
  const [selectedImage, setSelectedImage] = useState<any>(null); // Store image file
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Preview the image

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Set the file
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (e: any) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("firstName", data?.firstName);
    formData.append("lastName", data?.lastName);
    formData.append("email", data?.email);
    formData.append("phone", data?.phone);
    formData.append("password", data?.password);
    formData.append("role", data?.role);

    if (selectedImage) {
      formData.append("photo", selectedImage); // Append the photo
    }

    try {
      const res = await userPrivateRequest.post(`/api/users`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for form-data
        },
      });

      toast.success(res.data?.message);
      fetchUsers(); // Refresh the user list
      setData({}); // Reset form
      closeModal(); // Close modal
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal isOpen={ModalOpen} close={CloseModal}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="max-h-full w-full overflow-hidden ti-modal-content text-balance">
            <div className="ti-modal-header">
              <h6
                className="modal-title text-[1rem] font-semibold text-defaulttextcolor"
                id="mail-ComposeLabel"
              >
                Bill: #00001
              </h6>
              <button
                type="button"
                className="hs-dropdown-toggle !text-[1rem] !font-semibold !text-defaulttextcolor"
                onClick={CloseModal}
              >
                <span className="sr-only">Close</span>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="ti-modal-body px-4 overflow-y-auto">
              <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="case-amount" className="form-label">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="case-amount"
                    placeholder="Enter Amount"
                    value={data?.amount || ""}
                    onChange={(e) =>
                      setData({ ...data, amount: e.target.value })
                    }
                  />
                </div>

                <div className="xl:col-span-12 col-span-12">
                  <label className="form-label">Method</label>
                  <Select
                    name="role"
                    options={roles?.map((role) => ({
                      value: role._id,
                      label: role.name,
                    }))}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select Method"
                    onChange={(e: any) => {
                      setData({ ...data, role: e.value });
                    }}
                  />
                </div>

                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="contact-mail" className="form-label mt-2">
                    Date
                  </label>
                  <DatePicker
                    className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                    showIcon
                    selected={moment(data?.dateOfBirth).toDate()}
                    onChange={(date) =>
                      setData({
                        ...data,
                        dateOfBirth: date,
                      })
                    }
                  />
                </div>
                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="case-payment-note" className="form-label">
                    Note
                  </label>
                  <textarea
                    className="form-control !rounded-md border-1 "
                    id="case-payment-note"
                    rows={2}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="ti-modal-footer">
              <button
                type="button"
                className="hs-dropdown-toggle ti-btn  ti-btn-light align-middle"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ti-btn bg-primary text-white !font-medium"
                onClick={handleSubmit}
                disabled={isSubmitting} // Disable button when submitting
              >
                {isSubmitting ? (
                  <ButtonSpinner text="Adding Payment" />
                ) : (
                  "Add Payment"
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
