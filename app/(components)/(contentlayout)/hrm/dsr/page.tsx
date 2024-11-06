"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { userPrivateRequest } from "@/config/axios.config";
import CreateHrmstModal from "@/shared/page-components/hrm/dsr/CreateHrmsModal";
import { toast } from "react-toastify";
import EventHrmsModal from "@/shared/page-components/hrm/dsr/EventHrmsModal";
import moment from "moment";
import { hasPermission } from "@/utils/utils";

const Fullcalendar = () => {
  const [pageData, setPageData] = useState({});
  const [calendars, setDsrRecords] = useState<any[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false); // State for event details modal
  const [selectedEventData, setSelectedEventData] = useState(null); // State for selected event data

  // Helper function to create event IDs
  let eventGuid = 0;
  useEffect(() => {
    const fetchPageData = async () => {
      const res = await userPrivateRequest.get("/api/hrm/dsr/data/get");
      setPageData(res.data.data ?? {});
    };
    fetchPageData();
  }, []);

  // Fetch calendars and handle selection from localStorage or default
  const fetchDsrRecords = async () => {
    const res = await userPrivateRequest.get("/api/hrm/dsr?limit=9999999");
    const records = res.data.data?.docs ?? [];

    console.log("records", records);

    const event = records.map((event) => {
      return {
        id: event._id,
        title: event.title,
        start: event.date,
        description: event.description,
        case: event.case,
        hourCount: event.hourCount,
        hourlyRate: event.hourlyRate,
      };
    });
    setFilteredEvents(event);
  };

  useEffect(() => {
    fetchDsrRecords();

    // Call the function every 5 minutes (300,000 milliseconds)
    const intervalId = setInterval(() => {
      fetchDsrRecords();
    }, 30000); // 5 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleDateSelect = (selectInfo: any) => {
    let { start } = selectInfo;
    setIsCreateEventModalOpen(true);
    setSelectedDate(moment(start).format("YYYY-MM-DDTHH:mm:ss"));

    console.log("clicked", start);
  };

  function renderEventContent(eventInfo: any) {
    const hasReminders = eventInfo.event.extendedProps.reminders?.length > 0;

    return (
      <div
        className="items-center"
        style={{
          backgroundColor: eventInfo.backgroundColor || "#007bff",
          color: eventInfo.textColor || "#ffffff",
        }}
      >
        {/* Event time */}
        <b className="">{eventInfo.timeText}</b>

        {/* Event title */}
        <span className="">{eventInfo.event.title}</span>

        {/* {hasReminders && (
          <i
            className="ri-alarm-line text-yellow-500"
            title="Has reminders"
          ></i>
        )} */}
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
      // end: clickInfo.event.end,
      // date: clickInfo.event?.date,
      description: clickInfo.event.extendedProps.description,
      hourCount: clickInfo.event.extendedProps.hourCount,
      hourlyRate: clickInfo.event.extendedProps.hourlyRate,
      case: clickInfo.event.extendedProps.case,
    });
    setIsEventDetailsModalOpen(true); // Open event details modal
  };

  const handleEvents = () => {};

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState(null);

  return (
    <Fragment>
      <Seo title={"DSR"} />
      <Pageheader currentpage="DSR" activepage="Apps" mainpage="DSR" />
      {hasPermission("event.create") && (
        <CreateHrmstModal
          isOpen={isCreateEventModalOpen}
          onClose={() => setIsCreateEventModalOpen(false)}
          pageData={pageData}
          selectedDate={selectedDate}
          onCreateEvent={() => {
            fetchDsrRecords();
          }}
        />
      )}

      {/* Event Details Modal */}
      {hasPermission("event.read") && (
        <EventHrmsModal
          isOpen={isEventDetailsModalOpen}
          onClose={() => setIsEventDetailsModalOpen(false)}
          eventData={selectedEventData}
          pageData={pageData}
          calendars={calendars}
          fetchDsrRecords={fetchDsrRecords}
        />
      )}

      <div className="">
        <div className="xl:col-span-3 col-span-12">
          <div className="box custom-box"></div>
        </div>
        <div className="xl:col-span-9 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">DSR</div>
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
