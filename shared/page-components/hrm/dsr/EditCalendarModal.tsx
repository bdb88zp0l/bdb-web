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
}: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public",
    sharedWith: [],
    sharedWithTeams: [],
    backgroundColor: "#ffffff",
    foregroundColor: "#000000",
  });

  // Pre-populate formData with calendar data
  useEffect(() => {
    if (calendar) {
      setFormData({
        title: calendar.title || "",
        description: calendar.description || "",
        visibility: calendar.visibility || "public",
        sharedWith: calendar.sharedWith || [],
        sharedWithTeams: calendar.sharedWithTeams || [],
        backgroundColor: calendar.backgroundColor || "#ffffff",
        foregroundColor: calendar.foregroundColor || "#000000",
      });
    }
  }, [calendar]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (selectedOptions: any) => {
    const sharedWith = [];
    const sharedWithTeams = [];

    selectedOptions.forEach((option: any) => {
      if (option.type === "user") {
        sharedWith.push(option.value);
      } else if (option.type === "team") {
        sharedWithTeams.push(option.value);
      }
    });

    setFormData((prevData) => ({
      ...prevData,
      sharedWith,
      sharedWithTeams,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await userPrivateRequest.patch(
        `/api/calendars/${calendar._id}`,
        formData
      );
      toast.success(response.data.message);
      onClose();
      onUpdateCalendar(); // Trigger calendar list update after editing
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating calendar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare select options for users and teams
  const options = [
    {
      label: "Users",
      options: pageData?.users?.map((user: any) => ({
        value: user._id,
        label: `${user.firstName} ${user.lastName}`,
        type: "user",
      })),
    },
    {
      label: "Teams",
      options: pageData?.teams?.map((team: any) => ({
        value: team._id,
        label: team.title,
        type: "team",
      })),
    },
  ];

  // Pre-fill selected options in the Select component
  const preSelectedOptions = [
    ...formData.sharedWith.map((item: any) => {
      const user = pageData.users?.find((u: any) => u._id === item._id);
      return user
        ? {
            value: user._id,
            label: `${user.firstName} ${user.lastName}`,
            type: "user",
          }
        : null;
    }),
    ...formData.sharedWithTeams.map((item: any) => {
      const team = pageData.teams?.find((t: any) => t._id === item._id);
      return team ? { value: team._id, label: team.title, type: "team" } : null;
    }),
  ].filter(Boolean); // Filter out null values
  // console.log("preSelectedOptions", preSelectedOptions);

  return (
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
                    value={formData.title}
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
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="xl:col-span-12 col-span-12">
                  <label className="form-label">Visibility</label>
                  <select
                    name="visibility"
                    className="form-control"
                    value={formData.visibility}
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
                    defaultValue={preSelectedOptions}
                    className="basic-multi-select"
                    classNamePrefix="Select"
                    placeholder="Select Users or Teams"
                    onChange={handleSelectChange}
                  />
                </div>
                <div className="col-span-6">
                  <label className="form-label">Background Color</label>
                  <input
                    type="color"
                    name="backgroundColor"
                    className="h-10 w-10 block bg-white "
                    placeholder="Background Color"
                    value={formData.backgroundColor}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-span-6">
                  <label className="form-label">Foreground Color</label>
                  <input
                    type="color"
                    name="foregroundColor"
                    className="h-10 w-10 block bg-white "
                    placeholder="Foreground Color"
                    value={formData.foregroundColor}
                    onChange={handleInputChange}
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
  );
};

export default EditCalendarModal;
