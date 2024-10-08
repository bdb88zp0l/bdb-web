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

const Fullcalendar = () => {
  let eventGuid = 0;
  const todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today
  const INITIAL_EVENTS = [
    {
      id: createEventId(),
      title: "Meeting",
      start: todayStr,
      end: new Date("2025-04-04 00:00").toISOString().replace(/T.*$/, ""),
    },
    {
      id: createEventId(),
      title: "Meeting Time",
      start: todayStr + "T16:00:00",
    },
  ];

  function createEventId() {
    return String(eventGuid++);
  }
  useEffect(() => {
    const draggableEl: any = document.getElementById("external-events");
    new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        const title = eventEl.getAttribute("title");
        const id = eventEl.getAttribute("data");
        const classValue = eventEl.getAttribute("class");
        return {
          title: title,
          id: id,
          className: classValue,
        };
      },
    });
  }, []);

  function renderEventContent(eventInfo: any) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }
  const handleEventClick = (clickInfo: any) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };
  const handleEvents = () => {};

  // Code to add event handlers

  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (selectInfo: any) => {
    let { start } = selectInfo;
    if (start < new Date()) {
      toast.error("You can't create event in past");
      return;
    }
    setIsCreateEventModalOpen(true);
    setSelectedDate(start);
    return;
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  // Code by arafat

  const [pageData, setPageData] = useState({});
  const [calendars, setCalendars] = useState([]);
  useEffect(() => {
    const fetchPageData = async () => {
      const res = await userPrivateRequest.get("/api/cases/data/get");
      setPageData(res.data.data ?? {});
    };
    fetchPageData();
  }, []);

  const fetchCalendars = async () => {
    const res = await userPrivateRequest.get("/api/calendars?limit=9999999");
    setCalendars(res.data.data?.docs ?? []);
    setSelectedCalendars(calendars.map((calendar) => calendar._id)); // Select all calendars by default
    updateFilteredEvents(
      calendars.map((calendar) => calendar._id),
      calendars
    );
  };
  useEffect(() => {
    fetchCalendars();
  }, []);

  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  // Update the events based on selected calendars
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
          });
        });
      }
    });

    setFilteredEvents(events);
  };
  // Handle calendar checkbox selection
  const handleCalendarSelect = (calendarId: string) => {
    const isSelected = selectedCalendars.includes(calendarId);
    const newSelectedCalendars = isSelected
      ? selectedCalendars.filter((id) => id !== calendarId)
      : [...selectedCalendars, calendarId];

    setSelectedCalendars(newSelectedCalendars);
    updateFilteredEvents(newSelectedCalendars, calendars);
  };

  return (
    <Fragment>
      <Seo title={"Calendar"} />
      <Pageheader
        currentpage="Calendar"
        activepage="Apps"
        mainpage="Calendar"
      />

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

      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-3 col-span-12">
          <div className="box custom-box">
            <div className="py-4 px-[1.25rem] border-b dark:border-defaultborder/10  !grid">
              <CreateCalendarModal
                pageData={pageData}
                onCreateCalendar={() => {
                  fetchCalendars();
                }}
              />
            </div>
            <div className="box-body !p-0">
              <div
                id="external-events"
                className="border-b dark:border-defaultborder/10 p-4"
              >
                {/* <div className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event !bg-primary border !border-primary">
                  <div className="fc-event-main">Calendar Events</div>
                </div> */}
                {calendars?.map((calendar) => {
                  return (
                    <div
                      className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event !bg-success border !border-success"
                      data-classname="bg-success"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox mr-2"
                        checked={selectedCalendars.includes(calendar._id)}
                        onChange={() => handleCalendarSelect(calendar._id)}
                      />
                      <div className="fc-event-main">{calendar?.title}</div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-b dark:border-defaultborder/10 ">
                <div className="flex items-center mb-4 justify-between">
                  <h6 className="font-semibold">Activity :</h6>
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
                  <li>
                    <div className="flex items-center justify-between flex-wrap">
                      <p className="mb-1 font-semibold">Monday, Jan 1,2023</p>
                      <span className="badge bg-light text-default mb-1">
                        12:00PM - 1:00PM
                      </span>
                    </div>
                    <p className="mb-0 text-mutedtext-[0.75rem]">
                      Meeting with a client about new project requirement.
                    </p>
                  </li>
                  <li>
                    <div className="flex items-center justify-between flex-wrap">
                      <p className="mb-1 font-semibold">
                        Thursday, Dec 29,2022
                      </p>
                      <span className="badge bg-success text-white mb-1">
                        Completed
                      </span>
                    </div>
                    <p className="mb-0 text-muted text-[0.75rem]">
                      Birthday party of niha suka
                    </p>
                  </li>
                  <li>
                    <div className="flex items-center justify-between flex-wrap">
                      <p className="mb-1 font-semibold">
                        Wednesday, Jan 3,2023
                      </p>
                      <span className="badge bg-warning/10 text-warning mb-1">
                        Reminder
                      </span>
                    </div>
                    <p className="mb-0 text-mutedtext-[0.75rem]">
                      WOrk taget for new project is completing
                    </p>
                  </li>
                  <li>
                    <div className="flex items-center justify-between flex-wrap">
                      <p className="mb-1 font-semibold">Friday, Jan 20,2023</p>
                      <span className="badge bg-light text-default mb-1">
                        06:00PM - 09:00PM
                      </span>
                    </div>
                    <p className="mb-0 text-mutedtext-[0.75rem]">
                      Watch new movie with family
                    </p>
                  </li>
                  <li>
                    <div className="flex items-center justify-between flex-wrap">
                      <p className="mb-1 font-semibold">
                        Saturday, Jan 07,2023
                      </p>
                      <span className="badge bg-danger/10 text-danger mb-1">
                        Due Date
                      </span>
                    </div>
                    <p className="mb-0 text-muted text-[0.75rem]">
                      Last day to pay the electricity bill and water bill.need
                      to check the bank details.
                    </p>
                  </li>
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
                  initialView="dayGridMonth"
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  // initialEvents={INITIAL_EVENTS}
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
