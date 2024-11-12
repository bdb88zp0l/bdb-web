import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Modal from "@/shared/modals/Modal";
import Select from "react-select";
import { toast } from "react-toastify";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import DatePicker from "react-datepicker";
import { userPrivateRequest } from "@/config/axios.config";
import moment from "moment";

// Dynamically import react-select to avoid SSR issues
const CreateEventModal = ({
  isOpen,
  onClose,
  pageData,
  onCreateEvent,
  selectedDate,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    task: "",

    hourCount: 0,
    date: selectedDate,
    case: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    userPrivateRequest
      .post("/api/hrm/dsr", { ...formData })
      .then((response) => {
        toast.success(response.data.message);
        onCreateEvent();
        setFormData({
          task: "",

          hourCount: 0,
          date: new Date(selectedDate),
          case: "",
        });
        onClose();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  const casesOptions = pageData?.cases?.map((caseInfo) => ({
    value: caseInfo._id,
    label: caseInfo.title,
  }));

  useEffect(() => {
    setFormData({
      ...formData,
      date: new Date(selectedDate),
    });
  }, [selectedDate]);
  return (
    <Modal isOpen={isOpen} close={onClose}>
      <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
        <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
          <div className="ti-modal-header">
            <h6 className="modal-title font-semibold text-defaulttextcolor">
              Create DSR
            </h6>
            <button
              onClick={onClose}
              className="hs-dropdown-toggle text-defaulttextcolor"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
          {/* <form onSubmit={handleSubmit}> */}
          <div className="ti-modal-body overflow-y-auto px-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="xl:col-span-12 col-span-12">
                <label className="form-label">Case</label>
                <Select
                  name="case"
                  options={casesOptions}
                  className="basic-multi-select"
                  classNamePrefix="Select2"
                  placeholder="Select Case"
                  onChange={(selectedOption: any) =>
                    setFormData({
                      ...formData,
                      case: selectedOption.value,
                    })
                  }
                />
              </div>
              <div className="xl:col-span-12 col-span-12">
                <label className="form-label">Task</label>
                <input
                  type="text"
                  name="task"
                  className="form-control"
                  placeholder="Task"
                  value={formData.task}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* <div className="xl:col-span-12 col-span-12">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div> */}

              <div className="xl:col-span-12 col-span-12">
                <label className="form-label">Hours</label>
                <input
                  type="number"
                  name="hourCount"
                  className="form-control"
                  placeholder="Hours"
                  value={formData.hourCount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="xl:col-span-12 col-span-12">
                <label className="form-label">Date</label>
                <div className="input-group">
                  <div className="input-group-text text-[#8c9097] dark:text-white/50">
                    {" "}
                    <i className="ri-calendar-line"></i>{" "}
                  </div>
                  <DatePicker
                    className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                    selected={formData?.date}
                    onChange={(date) => {
                      setFormData({
                        ...formData,
                        date: date,
                      });
                    }}
                    dateFormat="MMMM d, yyyy"
                  />
                </div>
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
              onClick={handleSubmit}
            >
              {isSubmitting ? <ButtonSpinner text="Creating" /> : "Create"}
            </button>
          </div>
          {/* </form> */}
        </div>
      </div>
    </Modal>
  );
};

export default CreateEventModal;
