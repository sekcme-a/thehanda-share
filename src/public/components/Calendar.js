import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment';
// import styles from 'src/public/styles/Calendar.module.css';
import { DockBottom, Tune } from 'mdi-material-ui';
import koLocale from '@fullcalendar/core/locales/ko';
import styles from "../styles/Calendar.module.css"
import { Button, ButtonBase, Checkbox, TextField, Dialog } from "@mui/material"

import { MobileDateTimePicker } from '@mui/x-date-pickers'
// import { TimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { FormControlLabel } from "@mui/material"
import Select from '@mui/material/Select';

import { firestore as db } from 'firebase/firebase';

const Calendar = ({events, setEvents, editable}) => {
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState({})

  useEffect(()=>{
    console.log(events)
  },[events])

  const onValuesChange = (type, value) => {
    if(editable){
      setSelectedEvent({...selectedEvent, [type]: value})
      console.log({...selectedEvent, [type]: value})
    }
  }
  const onMemoChange = (value) => {
    if(editable)
      setSelectedEvent({...selectedEvent, extendedProps:{...selectedEvent.extendedProps, memo: value}})
  }

  const calendarRef = useRef(null)

  const COLOR_PALLETE = {
    red: {bg: "rgba(255, 76, 81, 0.14)",text:"rgb(255, 76, 81)"},
    yellow:{bg: "rgba(255, 180, 0, 0.14)", text:"rgb(255, 180, 0)"},
    green: {bg: "rgba(86, 202, 0, 0.14)",text:"rgb(86, 202, 0)"},
    blue: {bg: "rgba(22, 177, 255, 0.14)",text:"rgb(22, 177, 255)"},
    purple: {bg: "rgba(145, 85, 253, 0.14)",text:"rgb(145, 85, 253)"},
  }

  useEffect(()=>{
    setIsLoading(true)
    const temp = events?.map((event) => {
      let newEvent = {...event}
      console.log(event)
      if(event.start?.seconds)
        newEvent={...newEvent, start: newEvent.start.toDate()}
      if(event.end?.seconds)
        newEvent={...newEvent, end: newEvent.end.toDate()}
      if(event.color==="red")
        newEvent={...newEvent, backgroundColor: COLOR_PALLETE.red.bg, borderColor: COLOR_PALLETE.red.bg, textColor: COLOR_PALLETE.red.text }
      if(event.color==="yellow")
        newEvent={...newEvent, backgroundColor: COLOR_PALLETE.yellow.bg, borderColor: COLOR_PALLETE.yellow.bg, textColor: COLOR_PALLETE.yellow.text }
      if(event.color==="green")
        newEvent={...newEvent, backgroundColor: COLOR_PALLETE.green.bg, borderColor: COLOR_PALLETE.green.bg, textColor: COLOR_PALLETE.green.text }
      if(event.color==="blue")
        newEvent={...newEvent, backgroundColor: COLOR_PALLETE.blue.bg, borderColor: COLOR_PALLETE.blue.bg, textColor: COLOR_PALLETE.blue.text }
      if(event.color==="purple")
        newEvent={...newEvent, backgroundColor: COLOR_PALLETE.purple.bg, borderColor: COLOR_PALLETE.purple.bg, textColor: COLOR_PALLETE.purple.text }
        // newEvent={...newEvent, backgroundColor: COLOR_PALLETE.yellow.bg, borderColor: COLOR_PALLETE.yellow.bg, textColor: COLOR_PALLETE.yellow.text, classNames:["asdf"] }
      return newEvent
    })
    console.log(temp)
    setData(temp)
    setIsLoading(false)
  },[events])


  // const handleEventClick = ({ event }) => {
  //   const title = prompt('Enter new title for the event', event.title);
  //   if (title) {
  //     setEvents((prevEvents) => {
  //       const index = prevEvents.findIndex((ev) =>ev.id.toString() === event.id)
  //       const updatedEvents = [...prevEvents];
  //       updatedEvents[index] = {...updatedEvents[index], title: title};
  //       return updatedEvents;
  //     });
  //     // Update event on backend or send updatedEvent to server
  //   }
  // };

  const handleEventClick = ({event}) => {
    setIsOpenDialog(true)
    const color = getColor(event.backgroundColor)
    setSelectedEvent({
      title: event._def.title,
      url: event._def.url,
      start: event._instance.range.start,
      end: event._instance.range.end,
      allDay: event._def.allDay,
      color: color,
      extendedProps: {
        ...event._def.extendedProps
      }
    })
    console.log({
      title: event._def.title,
      url: event._def.url,
      start: event._instance.range.start,
      end: event._instance.range.end,
      allDay: event._def.allDay,
      color: color,
      extendedProps: {
        ...event._def.extendedProps
      }
    })
  }

  //get color from COLOR_PALLETE
  const getColor = (rgb) => {
    if(COLOR_PALLETE.red.bg===rgb)
      return "red"
    else if(COLOR_PALLETE.yellow.bg===rgb)
      return "blue"
    else if(COLOR_PALLETE.green.bg===rgb)
      return "green"
    else if(COLOR_PALLETE.blue.bg===rgb)
      return "blue"
    else if(COLOR_PALLETE.purple.bg===rgb)
      return "purple"
  }

  function handleEventChange(changeInfo) {
    const updatedEvent = {
      ...changeInfo.event,
      start: changeInfo.event.start,
      end: changeInfo.event.end,
    };
    console.log(events)
    setEvents((prevData) => {
      let prevEvents = prevData
      const index = prevEvents.data.findIndex((event) => event.extendedProps.id === updatedEvent._def.extendedProps.id && event.title === updatedEvent._def.title)
      prevData.data[index] = {...prevData.data[index], start: updatedEvent.start, end: updatedEvent.end}
      return prevData
    })
    console.log(events)
  }


  const onSubmitClick =async() => {
    if(editable){
      console.log(events)
      setEvents((prevData) => {
        let prevEvents = prevData
        const index = prevEvents.data.findIndex((event) => event.extendedProps.id === selectedEvent.extendedProps.id && event.title === selectedEvent.title)
        console.log(index)
        prevData.data[index] = {...prevData.data[index], title:"asdf"}
        return prevData
      })
      console.log(events)
      // setEvents((prevData) => {
      //   let prevEvents = prevData
      //   const index = prevEvents.data.findIndex((event) => event.extendedProps.id === selectedEvent.extendedProps.id && event.title === selectedEvent.title)
      //   console.log(index)
      //   console.log(prevData.data[index])
      //   prevData = {...prevData, data: {...prevData.data[index], ...selectedEvent }}
      //   console.log(prevData)
      //   return prevData 
      // })

      // setEvents((prevData) => {
      //   let prevEvents = prevData
      //   console.log(prevData)
      //   const index = prevEvents.data.findIndex((event) => event.extendedProps.id === updatedEvent._def.extendedProps.id && event.title === updatedEvent._def.title)
      //   prevData.data[index] = {...prevData.data[index], start: updatedEvent.start, end: updatedEvent.end}
      //   return prevData
      // })
    }
  }

  if(isLoading)
    <></>

  return (
    <>
      <FullCalendar
        plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin,]}
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
        events={data}
        // eventColor="rgb(154, 111, 195)"
        // events={'https://fullcalendar.io/api/demo-feeds/events.json?overload-day'}
        editable={editable}
        eventClick={handleEventClick}
        // className={styles.calendar}
        dragScroll={true}
        dayMaxEvents={true}
        navLinks={true}
        ref={calendarRef}
        eventChange={handleEventChange}
        eventResizableFromStart={true}
        eventResize={function(info) {
          
          // alert(info.event.title + " end is now " + info.event.end.toISOString());
          // console.log(info)
          // if (!confirm("is this okay?")) {
            // info.revert();
          // }
        }}
        locale={koLocale}
        
      />  

      <Dialog open={isOpenDialog} onClose={()=>setIsOpenDialog(false)}>
        <div className={styles.dialog_container}>
          
          <TextField variant="standard" sx={{mt:"5px"}} fullWidth size="small" label="제목" value={selectedEvent.title} onChange={(e)=>onValuesChange("title", e.target.value)}/>
          <TextField variant="standard" sx={{mt:"5px"}} fullWidth size="small" label="이동할 주소" placeholder="https://dahanda.netlify.app/" value={selectedEvent.url} onChange={(e)=>onValuesChange("url", e.target.value)}/>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDateTimePicker
              label="시작일"
              value={selectedEvent.start}
              onChange={(e)=>onValuesChange("start", e)}
              renderInput={params => <TextField {...params} sx={{ width: "100%" }} variant="standard" style={{marginTop:"5px"}}/>}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDateTimePicker
              label="종료일"
              value={selectedEvent.end}
              onChange={(e)=>onValuesChange("end", e)}
              renderInput={params => <TextField {...params} sx={{ width: "100%" }} variant="standard" style={{marginTop:"5px"}}/>}
            />
          </LocalizationProvider>

          <FormControlLabel
            control={
              <Checkbox checked={selectedEvent.allDay} onChange={(e)=>onValuesChange("allDay", e.target.checked)}/>
            }
            label="종일 일정" sx={{mt:"5px"}}
          />

          <FormControl fullWidth sx={{mt:"13px"}}>
            <p style={{fontSize:"12px", marginBottom:"5px"}}>색상선택</p>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedEvent.color}
              label="색깔"
              onChange={(e)=>onValuesChange("color", e.target.value)}
              size="small"
              variant="standard"

            >
              <MenuItem value="red">빨강</MenuItem>
              <MenuItem value="yellow">노랑</MenuItem>
              <MenuItem value="green">초록</MenuItem>
              <MenuItem value="blue">파랑</MenuItem>
              <MenuItem value="purple">보라</MenuItem>
            </Select>
          </FormControl>

          <TextField variant="standard" multiline  sx={{mt:"5px"}} fullWidth size="small" label="추가 메모" value={selectedEvent.extendedProps?.memo} onChange={(e)=>onMemoChange(e.target.value)}/>

          {editable && 
            <div className={styles.button_container}>
              <Button onClick={onSubmitClick} variant="contained" size="small" fullWidth>일정 편집</Button>
            </div>
          }
        </div>
      </Dialog>
    </>
  );
};

export default Calendar;
