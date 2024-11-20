"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import CreateCalendarModal from "@/shared/page-components/calendar/CreateCalendarModal";
import { userPrivateRequest } from "@/config/axios.config";
import CreateEventModal from "@/shared/page-components/calendar/CreateEventModal";
import { toast } from "react-toastify";
import EventDetailsModal from "@/shared/page-components/calendar/EventDetailsModal";
import CalendarDetailsModal from "@/shared/page-components/calendar/CalendarDetailsModal";
import moment from "moment";
import { hasPermission } from "@/utils/utils";

const Fullcalendar = () => {
  const [pageData, setPageData] = useState({});
  const [calendars, setCalendars] = useState<any[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false); // State for event details modal
  const [selectedEventData, setSelectedEventData] = useState(null); // State for selected event data

  // Helper function to create event IDs
  let eventGuid = 0;
  function createEventId() {
    return String(eventGuid++);
  }

  // useEffect(() => {
  //   const draggableEl: any = document.getElementById("external-events");
  //   new Draggable(draggableEl, {
  //     itemSelector: ".fc-event",
  //     eventData: function (eventEl) {
  //       const title = eventEl.getAttribute("title");
  //       const id = eventEl.getAttribute("data");
  //       const classValue = eventEl.getAttribute("class");
  //       return {
  //         title: title,
  //         id: id,
  //         className: classValue,
  //       };
  //     },
  //   });
  // }, []);

  // Function to update filtered events based on selected calendars
  const updateFilteredEvents = (selectedIds: string[], calendars: any[]) => {
    const events: any[] = [];
    calendars.forEach((calendar) => {
      if (selectedIds.includes(calendar._id)) {
        calendar.events.forEach((event: any) => {
          events.push({
            id: event._id,
            title: event.title,
            start: event.startDate,
            end: event.endDate,
            allDay: event.allDay,
            description: event.description, // Add description
            reminders: event.reminder, // Add reminders
            location: event.location, // Add location
            calendar: event.calendar, // Add calendar
            ...(calendar?.backgroundColor && {
              backgroundColor: calendar?.backgroundColor,
              borderColor: calendar?.backgroundColor,
            }), // Add backgroundColor
            ...(calendar?.foregroundColor && {
              textColor: calendar?.foregroundColor,
            }), // Add foregroundColor
            // backgroundColor: "#aa5fb4",
            source: calendar?.source ?? "local",
          });
        });
      }
    });
    setFilteredEvents(events);
  };

  useEffect(() => {
    const fetchPageData = async () => {
      const res = await userPrivateRequest.get("/api/calendars/data/get");
      setPageData(res.data.data ?? {});
    };
    fetchPageData();
  }, []);

  // Fetch calendars and handle selection from localStorage or default
  const fetchCalendars = async () => {
    const res = await userPrivateRequest.get("/api/calendars?limit=9999999");
    const calendarsData = res.data.data?.docs ?? [];
    setCalendars(calendarsData);

    // Retrieve selected calendars from localStorage
    const storedCalendarIds = JSON.parse(
      localStorage.getItem("selectedCalendars") || "[]"
    );

    if (storedCalendarIds.length > 0) {
      setSelectedCalendars(storedCalendarIds);
      updateFilteredEvents(storedCalendarIds, calendarsData);
    } else {
      // Select all calendars by default if nothing is stored in localStorage
      const allCalendarIds = calendarsData.map((calendar) => calendar._id);
      setSelectedCalendars(allCalendarIds);
      updateFilteredEvents(allCalendarIds, calendarsData);
    }
  };

  useEffect(() => {
    fetchCalendars();
    
    // Call the function every 5 minutes (300,000 milliseconds)
    const intervalId = setInterval(() => {
      fetchCalendars();
    }, 30000); // 5 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to handle calendar checkbox selection
  const handleCalendarSelect = (calendarId: string) => {
    const isSelected = selectedCalendars.includes(calendarId);
    const newSelectedCalendars = isSelected
      ? selectedCalendars.filter((id) => id !== calendarId)
      : [...selectedCalendars, calendarId];

    setSelectedCalendars(newSelectedCalendars);
    updateFilteredEvents(newSelectedCalendars, calendars);

    // Store the updated calendar selection in localStorage
    localStorage.setItem(
      "selectedCalendars",
      JSON.stringify(newSelectedCalendars)
    );
  };

  const handleDateSelect = (selectInfo: any) => {
    let { start } = selectInfo;
    setIsCreateEventModalOpen(true);
    setSelectedDate(moment(start).format("YYYY-MM-DDTHH:mm:ss"));
  };

  function renderEventContent(eventInfo: any) {
    const hasReminders = eventInfo.event.extendedProps.reminders?.length > 0;

    return (
      <div
        className="flex items-center space-x-2"
        style={{
          backgroundColor: eventInfo.backgroundColor || "#007bff",
          color: eventInfo.textColor || "#ffffff",
        }}
      >
        {/* Event time */}
        <b className="">{eventInfo.timeText}</b>

        {/* Event title */}
        <span className="">{eventInfo.event.title}</span>

        {hasReminders && (
          <i
            className="ri-alarm-line text-yellow-500"
            title="Has reminders"
          ></i>
        )}
      </div>
    );
  }

  const handleEventClick = (clickInfo: any) => {
    // Set the selected event data to pass to the modal

    console.log(clickInfo);
    setSelectedEventData({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      allDay: clickInfo.event.allDay,
      description: clickInfo.event.extendedProps.description,
      location: clickInfo.event.extendedProps.location,
      reminders: clickInfo.event.extendedProps.reminders,
      calendar: clickInfo.event.extendedProps.calendar,
      source: clickInfo.event.extendedProps?.source ?? "",
    });
    setIsEventDetailsModalOpen(true); // Open event details modal
  };

  const handleEvents = () => {};

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState(null);

  const handleCalendarClick = (calendar: any) => {
    setSelectedCalendar(calendar);
    setIsCalendarModalOpen(true);
  };

  return (
    <Fragment>
      <Seo title={"Calendar"} />
      <Pageheader
        currentpage="Calendar"
        activepage="Apps"
        mainpage="Calendar"
      />
      {hasPermission("event.create") && (
        <CreateEventModal
          isOpen={isCreateEventModalOpen}
          onClose={() => setIsCreateEventModalOpen(false)}
          pageData={pageData}
          calendars={calendars}
          selectedDate={selectedDate}
          onCreateEvent={() => {
            fetchCalendars();
          }}
        />
      )}

      {/* Event Details Modal */}
      {hasPermission("event.read") && (
        <EventDetailsModal
          isOpen={isEventDetailsModalOpen}
          onClose={() => setIsEventDetailsModalOpen(false)}
          eventData={selectedEventData}
          pageData={pageData}
          calendars={calendars}
          fetchCalendars={fetchCalendars}
        />
      )}

      {hasPermission("calendar.read") && (
        <CalendarDetailsModal
          isOpen={isCalendarModalOpen}
          onClose={() => {
            setIsCalendarModalOpen(false);
          }}
          calendar={selectedCalendar}
          pageData={pageData}
          calendars={calendars}
          fetchCalendars={fetchCalendars}
        />
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-3 col-span-12">
          <div className="box custom-box">
            <div className="py-4 px-[1.25rem] border-b dark:border-defaultborder/10  !grid">
              {hasPermission("calendar.create") && (
                <CreateCalendarModal
                  pageData={pageData}
                  onCreateCalendar={() => {
                    fetchCalendars();
                  }}
                />
              )}
            </div>
            <div className="box-body !p-0">
              <div
                id="external-events"
                className="border-b dark:border-defaultborder/10 p-4"
              >
                {calendars?.map((calendar) => {
                  return (
                    <div
                      key={Math.random()}
                      className={`fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event  border flex gap-2`}
                      // data-classname="bg-success"
                      style={{
                        cursor: "pointer",
                        backgroundColor: calendar?.backgroundColor ?? "#26bf94",
                        borderColor: calendar?.backgroundColor ?? "#26bf94",
                      }}
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox mr-2"
                        checked={selectedCalendars.includes(calendar._id)}
                        onChange={(e) => {
                          e.preventDefault();
                          handleCalendarSelect(calendar._id);
                        }}
                      />
                      <div
                        className="fc-event-main"
                        style={{
                          color: calendar?.foregroundColor ?? "#ffffff",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          if (calendar.source !== "outlook") {
                            handleCalendarClick(calendar);
                          }
                        }} // Open modal
                      >
                        {calendar?.title}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-b dark:border-defaultborder/10 ">
                <div className="flex items-center mb-4 justify-between">
                  <h6 className="font-semibold">Upcoming Events :</h6>
                  <button
                    type="button"
                    className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-primary btn-wave"
                  >
                    View All
                  </button>
                </div>
                <ul
                  className="list-none mb-0 fullcalendar-events-activity"
                  id="full-calendar-activity"
                >
                  {filteredEvents
                    ?.sort((a: any, b: any) => {
                      return new Date(a.start).getTime() - new Date(b.start).getTime();
                    })
                    .map((event) => {
                      return (
                        <li key={Math.random()}>
                          <div className="flex items-center justify-between flex-wrap">
                            <p className="mb-1 font-semibold">
                              {moment
                                .utc(event?.start)
                                .format("ddd, MMM DD, YYYY")
                                .toString()}
                              {moment.utc(event?.start).date() <
                              moment.utc(event?.end).date() ? (
                                <span className="">
                                  {" "}
                                  -{" "}
                                  {moment
                                    .utc(event?.end)
                                    .format("ddd, MMM DD, YYYY")}
                                </span>
                              ) : (
                                ""
                              )}
                            </p>
                            <span className="badge bg-light text-default mb-1">
                              {moment.utc(event?.start).format("hh:mm a")} -{" "}
                              {moment.utc(event?.end).format("hh:mm a")}
                            </span>
                          </div>
                          <p className="mb-0 text-mutedtext-[0.75rem]">
                            {event?.title}
                          </p>
                        </li>
                      );
                    })}
                </ul>
              </div>
              <div className="p-4">
                <img src="../../assets/images/media/media-83.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="xl:col-span-9 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">Calendar</div>
            </div>
            <div className="box-body">
              <div id="calendar2">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  initialView="timeGridWeek"
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  select={handleDateSelect}
                  eventContent={renderEventContent}
                  eventClick={handleEventClick}
                  eventsSet={handleEvents}
                  events={filteredEvents} // Display the filtered events
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Fullcalendar;
