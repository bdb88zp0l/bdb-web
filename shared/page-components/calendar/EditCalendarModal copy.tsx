import React, { useEffect, useState } from "react";
import Modal from "@/shared/modals/Modal";
import Select from "react-select";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import { toast } from "react-toastify";
import { userPrivateRequest } from "@/config/axios.config";

const EditCalendarModal = ({
  isOpen,
  onClose,
  pageData,
  onUpdateCalendar,
  calendar,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(calendar);

  useEffect(() => {
    setFormData(calendar);
  }, [calendar]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selectedOptions) => {
    const sharedWith = [];
    const sharedWithTeams = [];

    // Check each selected option and assign it to the correct field (sharedWith or sharedWithTeams)
    selectedOptions.forEach((option) => {
      if (option.type === "user") {
        sharedWith.push(option.value); // Add user IDs to sharedWith
      } else if (option.type === "team") {
        sharedWithTeams.push(option.value); // Add team IDs to sharedWithTeams
      }
    });

    // Update the formData
    setFormData({ ...formData, sharedWith, sharedWithTeams });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    userPrivateRequest
      .post(`/api/calendars`, formData)
      .then((response) => {
        toast.success(response.data.message);
        onClose();
        onUpdateCalendar();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Prepare options for the select field with grouped users and teams
  const options = [
    {
      label: "Users",
      options: pageData?.users?.map((user) => ({
        value: user._id,
        label: `${user.firstName} ${user.lastName}`,
        type: "user",
      })),
    },
    {
      label: "Teams",
      options: pageData?.teams?.map((team) => ({
        value: team._id,
        label: team.title,
        type: "team",
      })),
    },
  ];

  return (
    <>
      <Modal isOpen={isOpen} close={onClose}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
            <div className="ti-modal-header">
              <h6 className="modal-title font-semibold text-defaulttextcolor">
                Update Calendar
              </h6>
              <button
                onClick={onClose}
                className="hs-dropdown-toggle text-defaulttextcolor"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="ti-modal-body px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-12 col-span-12">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      placeholder="Calendar Title"
                      value={formData?.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="xl:col-span-12 col-span-12">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      placeholder="Calendar Description"
                      value={formData?.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="xl:col-span-12 col-span-12">
                    <label className="form-label">Visibility</label>
                    <select
                      name="visibility"
                      className="form-control"
                      value={formData?.visibility}
                      onChange={handleInputChange}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="protected">Protected</option>
                    </select>
                  </div>
                  <div className="xl:col-span-12 col-span-12">
                    <label className="form-label">Share With</label>
                    <Select
                      isMulti
                      options={options}
                      className="basic-multi-select"
                      classNamePrefix="Select"
                      placeholder="Select Users or Teams"
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>
              </div>
              <div className="ti-modal-footer">
                <button
                  type="button"
                  className="ti-btn ti-btn-light"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ti-btn bg-primary text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <ButtonSpinner text="Updating" /> : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditCalendarModal;
