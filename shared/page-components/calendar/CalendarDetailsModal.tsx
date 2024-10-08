import React, { useState } from "react";
import Modal from "@/shared/modals/Modal"; // Assuming your baseline modal component is named "Modal"
import EditCalendarModal from "./EditCalendarModal";
import { hasPermission } from "@/utils/utils";
import { userPrivateRequest } from "@/config/axios.config";
import { toast } from "react-toastify";

const CalendarDetailsModal = ({
  isOpen,
  onClose,
  calendar,
  pageData,
  fetchCalendars,
}: any) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    userPrivateRequest
      .delete(`/api/calendars/${id}`)
      .then((res) => {
        toast.success("Calendar deleted successfully");
        onClose();
        fetchCalendars();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  return (
    <>
      <Modal isOpen={isOpen} close={onClose}>
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
            <div className="ti-modal-header">
              <h6 className="modal-title font-semibold text-defaulttextcolor">
                Calendar Details
              </h6>
              <button
                onClick={onClose}
                className="hs-dropdown-toggle text-defaulttextcolor"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className="ti-modal-body space-y-4 overflow-y-auto">
              {/* Title */}
              <div>
                <h4 className="text-lg font-semibold">Title</h4>
                <p className="text-gray-700">
                  {calendar?.title || "No title available"}
                </p>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold">Description</h4>
                <p className="text-gray-700">
                  {calendar?.description || "No description available"}
                </p>
              </div>

              {/* Visibility */}
              <div>
                <h4 className="text-lg font-semibold">Visibility</h4>
                <p className="text-gray-700 capitalize">
                  {calendar?.visibility || "Not specified"}
                </p>
              </div>

              {/* Shared With Users */}
              <div>
                <h4 className="text-lg font-semibold">Shared With Users</h4>
                <ul className="text-gray-700">
                  {calendar?.sharedWith?.length > 0 ? (
                    calendar.sharedWith.map((user: any, index: number) => (
                      <li
                        key={Math.random()}
                        className="flex items-center space-x-2"
                      >
                        <span className="badge bg-light text-default rounded-full ms-1 text-[0.75rem] align-middle">
                          {user?.firstName || "Unknown"} {user?.lastName || ""}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li>No users shared</li>
                  )}
                </ul>
              </div>

              {/* Shared With Teams */}
              <div>
                <h4 className="text-lg font-semibold">Shared With Teams</h4>
                <ul className="text-gray-700">
                  {calendar?.sharedWithTeams?.length > 0 ? (
                    calendar.sharedWithTeams.map((team: any, index: number) => (
                      <li
                        key={Math.random()}
                        className="flex items-center space-x-2"
                      >
                        <span className="badge bg-light text-default rounded-full ms-1 text-[0.75rem] align-middle">
                          {team?.title || "Unknown"}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li>No teams shared</li>
                  )}
                </ul>
              </div>
            </div>
            {/* Modal Footer */}

            <div className="ti-modal-footer">
              {hasPermission("calendar.delete") && (
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
                      handleDelete(calendar?._id);
                    }
                  }}
                >
                  <i className="ri-delete-bin-line"></i> Delete
                </button>
              )}
              <button
                onClick={openEditModal}
                className="ti-btn ti-btn-light text-defaulttextcolor"
              >
                <i className="ri-edit-line"></i> Edit
              </button>
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
      </Modal>

      {hasPermission("calendar.update") && (
        <EditCalendarModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          pageData={pageData}
          calendar={calendar}
          onUpdateCalendar={() => {
            fetchCalendars();
            onClose();
          }}
        />
      )}
    </>
  );
};

export default CalendarDetailsModal;
