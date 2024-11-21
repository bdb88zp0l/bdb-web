import Modal from "@/shared/modals/Modal";
import React, { useState } from "react";
import EditEventModal from "./EditEventModal";
import { hasPermission } from "@/utils/utils";
import { userPrivateRequest } from "@/config/axios.config";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";

const EventDetailsModal = ({
  isOpen,
  onClose,
  eventData,
  pageData,
  calendars,
  fetchCalendars,
}: any) => {
  if (!isOpen || !eventData) return null;
  const { title, description, start, end, location, reminders, id } = eventData;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    userPrivateRequest
      .delete(`/api/events/${id}`)
      .then((res) => {
        toast.success("Event deleted successfully");
        onClose();
        fetchCalendars();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const cleanHtml = DOMPurify.sanitize(description, {
    ADD_ATTR: ["target"],
    FORBID_TAGS: ["style"], // Example: if you want to forbid certain tags
  });

  return (
    <>
      <Modal isOpen={isOpen} close={onClose}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
            <div className="ti-modal-header">
              <h6 className="modal-title font-semibold text-defaulttextcolor">
                Event Details
              </h6>
              <button
                onClick={onClose}
                className="hs-dropdown-toggle text-defaulttextcolor"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className="ti-modal-body space-y-4 overflow-y-auto">
              <div>
                <strong>Matter:</strong>
                <p>{title}</p>
              </div>

              <div>
                <strong>Description:</strong>
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  children={cleanHtml} // Updated this line
                />
              </div>

              <div>
                <strong>Location:</strong>
                <p>{location || "Not specified"}</p>
              </div>

              <div>
                <strong>Start Time:</strong>
                <p>{new Date(start).toLocaleString()}</p>
              </div>

              <div>
                <strong>End Time:</strong>
                <p>{end ? new Date(end).toLocaleString() : "Not specified"}</p>
              </div>

              <div>
                <strong>Reminders:</strong>
                {reminders && reminders.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {reminders.map((reminder: any, index: number) => (
                      <li key={index}>
                        {new Date(reminder.time).toLocaleString()} - Notified:{" "}
                        {reminder.notified ? "Yes" : "No"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No reminders set.</p>
                )}
              </div>
            </div>
            <div className="ti-modal-footer">
              {hasPermission("event.delete") &&
                eventData?.source !== "outlook" && (
                  <button
                    aria-label="button"
                    type="button"
                    className="ti-btn ti-btn-danger contact-delete"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this item?"
                        )
                      ) {
                        handleDelete(eventData?.id);
                      }
                    }}
                  >
                    <i className="ri-delete-bin-line"></i> Delete
                  </button>
                )}
              {hasPermission("event.update") &&
                eventData?.source !== "outlook" && (
                  <button
                    onClick={openEditModal}
                    className="ti-btn ti-btn-light text-defaulttextcolor"
                  >
                    <i className="ri-edit-line"></i> Edit
                  </button>
                )}
              <button
                type="button"
                className="ti-btn ti-btn-light"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
        {/* </div> */}
      </Modal>
      {/* Edit Event Modal */}

      {hasPermission("event.update") && (
        <EditEventModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          event={eventData} // Pass the event data to pre-fill in the edit modal
          pageData={pageData}
          calendars={calendars}
          onUpdate={() => {
            fetchCalendars();
            onClose();
          }}
        />
      )}
    </>
  );
};

export default EventDetailsModal;
