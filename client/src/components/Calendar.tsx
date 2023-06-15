import React, { useState } from "react";
import { DateSelectArg, EventApi, EventClickArg, formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, List, ListItem, ListItemText, Typography, useTheme } from "@mui/material";
import Header from "./Header";
import { tokens } from "../theme";

const Calendar: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);

  const handleDateClick = (selected: DateSelectArg) => {
    const title = prompt("Please enter a new title for your event.");
    const clendarApi = selected.view.calendar;

    clendarApi.unselect();

    if (title) {
      clendarApi.addEvent({
        id: `${selected.startStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
    }
  };

  const handleEventClick = (selected: EventClickArg) => {
    if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'?`)) {
      selected.event.remove();
    }
  };

  return (
    <Box m="20px">
      <Header title="CALENDAR" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box flex="1 1 20%" bgcolor={colors.primary[400]} p="15px" borderRadius="4px">
          <Typography variant="h3">Events</Typography>
          <List>
            {currentEvents.map((event: EventApi) => (
              <ListItem
                key={event.id}
                sx={{ backgroundColor: colors.greenAccent[500], margin: "10px 0", borderRadius: "2px" }}
              >
                <ListItemText
                  primary={
                    <Typography color={colors.primary[500]} variant="h4">
                      {event.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="h5">
                      {formatDate(event.start as Date, { year: "numeric", month: "short", day: "numeric" })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events: EventApi[]) => {
              setCurrentEvents(events);
            }}
            initialEvents={[
              { id: "1234", title: "All-day event", date: "2023-06-14", end: "2023-06-17" },
              { id: "4321", title: "Timed event", date: "2023-06-28" },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
