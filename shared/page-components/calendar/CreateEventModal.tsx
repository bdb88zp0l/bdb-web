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
  calendars,
  onCreateEvent,
  selectedDate,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: selectedDate,
    endDate: selectedDate,
    allDay: false,
    reminder: [],
    calendar: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    userPrivateRequest
      .post("/api/events", { ...formData, reminder: reminders })
      .then((response) => {
        toast.success(response.data.message);
        onCreateEvent();
        setFormData({
          title: "",
          description: "",
          location: "",
          startDate: new Date(selectedDate),
          endDate: new Date(selectedDate),
          allDay: false,
          reminder: [],
          calendar: "",
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
  const calendarOptions = calendars
    ?.filter((i) => {
      if (i.source == "outlook") {
        return false;
      }
      return true;
    })
    ?.map((calendar) => ({
      value: calendar._id,
      label: calendar.title,
    }));
  const [reminders, setReminders] = useState([]);

  const handleAddReminder = () => {
    setReminders([...reminders, { time: new Date() }]); // Add a new reminder with default current time
  };

  const handleReminderChange = (index: number, newTime: Date) => {
    const updatedReminders = reminders.map((reminder, i) =>
      i === index ? { ...reminder, time: newTime } : reminder
    );
    setReminders(updatedReminders);
  };

  const handleRemoveReminder = (index: number) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    setReminders(updatedReminders);
  };

  useEffect(() => {
    setFormData({
      ...formData,
      startDate: new Date(selectedDate),
      endDate: moment(selectedDate).add(1, "hour").toDate(),
    });
  }, [selectedDate]);
  return (
    <Modal isOpen={isOpen} close={onClose}>
      <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
        <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
          <div className="ti-modal-header">
            <h6 className="modal-title font-semibold text-defaulttextcolor">
              Create Event
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
                <label className="form-label">Calendar</label>
                <Select
                  name="calendar"
                  options={calendarOptions}
                  className="basic-multi-select"
                  classNamePrefix="Select2"
                  placeholder="Select Calendar"
                  onChange={(selectedOption: any) =>
                    setFormData({
                      ...formData,
                      calendar: selectedOption.value,
                    })
                  }
                />
              </div>
              <div className="xl:col-span-12 col-span-12">
                <label className="form-label">Matter</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Matter"
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
                  placeholder="Event Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="xl:col-span-12 col-span-12">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="Event Location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="xl:col-span-12 col-span-12">
                <label className="form-label">Start Date</label>
                <div className="input-group">
                  <div className="input-group-text text-[#8c9097] dark:text-white/50">
                    {" "}
                    <i className="ri-calendar-line"></i>{" "}
                  </div>
                  <DatePicker
                    className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                    selected={formData?.startDate}
                    onChange={(date) => {
                      setFormData({
                        ...formData,
                        startDate: date,
                      });
                    }}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>
              </div>

              <div className="xl:col-span-12 col-span-12">
                <label className="form-label">End Date</label>
                <div className="input-group">
                  <div className="input-group-text text-[#8c9097] dark:text-white/50">
                    {" "}
                    <i className="ri-calendar-line"></i>{" "}
                  </div>
                  <DatePicker
                    className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                    selected={formData?.endDate}
                    onChange={(date) => {
                      setFormData({
                        ...formData,
                        endDate: date,
                      });
                    }}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>
              </div>

              {/* Reminders */}
              <div className="xl:col-span-12 col-span-12">
                <label className="form-label">Reminders</label>
                {reminders.map((reminder, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <DatePicker
                      selected={new Date(reminder.time)}
                      onChange={(date) => handleReminderChange(index, date)}
                      showTimeSelect
                      dateFormat="Pp"
                      className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                    />
                    <button
                      type="button"
                      className="ti-btn ti-btn-danger-full !px-2 !py-1"
                      onClick={() => handleRemoveReminder(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="ti-btn ti-btn-light"
                  onClick={handleAddReminder}
                >
                  Add Reminder
                </button>
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
