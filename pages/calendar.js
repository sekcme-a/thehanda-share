import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment';
import styles from 'src/calendar/styles/Calendar.module.css';
import { Tune } from 'mdi-material-ui';

const Calendar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      url: '',
      title: 'Design Review',
      start: "2023-04-01",
      end: "2023-04-02",
      // allDay: true,
      extendedProps: {
        calendar: 'Business'
      }
    },
    {"title":"All Day Event","start":"2023-04-01"},
    {"title":"Long Event","start":"2023-04-07","end":"2023-04-10"},
    {"groupId":"999","title":"Repeating Event","start":"2023-04-09T16:00:00+00:00"},
    {"groupId":"999","title":"Repeating Event","start":"2023-04-16T16:00:00+00:00"},
    {"title":"Conference","start":"2023-04-18","end":"2023-04-20"},
    {"title":"Meeting","start":"2023-04-19T10:30:00+00:00","end":"2023-04-19T12:30:00+00:00"},
    {"title":"Lunch","start":"2023-04-19T12:00:00+00:00"},
    {"title":"Birthday Party","start":"2023-04-20T07:00:00+00:00"},
    {"url":"http:\/\/google.com\/","title":"Click for Google","start":"2023-04-28"}
  ]);
  // const [events, setEvents] = useState([
  //   {
  //     id: 1,
  //     title: 'Event 1',
  //     start: moment().toDate(),
  //     end: moment().add(34, 'hour').toDate(),
  //     allDay: false,
  //   },
  //   {
  //     id: 2,
  //     title: 'Event 2',
  //     start: moment().add(1, 'day').toDate(),
  //     end: moment().add(1, 'day').add(1, 'hour').toDate(),
  //     allDay: false,
  //   },
  // ]);

  const calendarRef = useRef(null)

  useEffect(()=>{
    // const asdf = {'https://fullcalendar.io/api/demo-feeds/events.json?overload-day'}
    // console.log()
  },[])

  const handleEventClick = ({ event }) => {
    const title = prompt('Enter new title for the event', event.title);
    if (title) {
      setEvents((prevEvents) => {
        const index = prevEvents.findIndex((ev) =>ev.id.toString() === event.id)
        const updatedEvents = [...prevEvents];
        updatedEvents[index] = {...updatedEvents[index], title: title};
        return updatedEvents;
      });
      // Update event on backend or send updatedEvent to server
    }
  };

  const handleLeftSidebarToggle = () => {
    alert("adsf")
  }

  const onEventResize = (eventResizeInfo) => {
    console.log(eventResizeInfo)
  }
  

  return (
    <FullCalendar
      plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
      initialView =  'dayGridMonth'
      headerToolbar= {{
        start: 'prev, next, title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      }}
      views= {{
        week: {
          titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
        }
      }}
      events={events}
      // events={'https://fullcalendar.io/api/demo-feeds/events.json?overload-day'}
      editable={true}
      eventClick={handleEventClick}
      // className={styles.calendar}
      dragScroll={true}
      dayMaxEvents={true}
      navLinks={true}
      ref={calendarRef}
      eventChange={function(event){
        console.log(event)
      }}
      eventResizableFromStart={true}
      eventResize={function(info) {
        alert(info.event.title + " end is now " + info.event.end.toISOString());
        console.log(info)
        if (!confirm("is this okay?")) {
          info.revert();
        }
      }}
      
    />
  );
};

export default Calendar;
