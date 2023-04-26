import { useEffect, useState } from "react"
import useData from "context/data"
import { useRouter } from "next/router"
import styles from "../styles/TeamSchedule.module.css"
import { firestore as db } from "firebase/firebase"
import Calendar from "src/public/components/Calendar"
import { Button, CircularProgress } from "@mui/material"

const TeamSchedule = () => {
  const {userData, teamId, setSubContent, calendar, setCalendar} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [events, setEvents] = useState([
    {
      id: 1,
      url: '',
      title: 'Design Review',
      start: new Date(),
      // end: "2023-04-02",
      allDay: true,
      extendedProps: {
        type: 'Business'
      },
      color: "red"
    },
    {"title":"All Day Event","start":"2023-04-01"},
    {"title":"Long Event","start":"2023-04-07","end":"2023-04-10"},
    {"title":"Repeating Event","start":"2023-04-09T16:00:00+00:00", color: "red",},
    {"groupId":"999","title":"Repeating Event","start":"2023-04-16T16:00:00+00:00"},
    {"title":"Conference","start":"2023-04-18","end":"2023-04-20"},
    {"title":"Meeting","start":"2023-04-19T10:30:00+00:00","end":"2023-04-19T12:30:00+00:00", "color": "rgb(204, 204, 0)"},
    {"title":"Lunch","start":"2023-04-19T12:00:00+00:00", color: "red"},
    {"title":"Birthday Party","start":"2023-04-20T07:00:00+00:00"},
    {"url":"http:\/\/google.com\/","title":"Click for Google","start":"2023-04-28"}
  ]);

  useEffect(()=>{
    const fetchData = async() => {

    }
    fetchData()
    setIsLoading(false)
  },[])


  useEffect(()=>{
    console.log(calendar)  
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    },50);
  },[calendar])

  const onSubmitClick = async () => {
    setIsSubmitting(true)
    await db.collection("team_admin").doc(teamId).update({
      calendar: calendar
    })
    setIsSubmitting(false)
    alert("적용되었습니다.")
  }

  if(isLoading)
    return(<CircularProgress />)

  return(
    <div className={styles.main_container}>
      <div style={{marginBottom:"15px", display:"flex", justifyContent:"space-between"}}>
        {/* <Button variant="contained" size="small" sx={{bgcolor:"#4D72B8"}}>일정 추가 +</Button> */}
        {/* <Button variant="contained" size="small" sx={{bgcolor:"darkblue"}}>저장</Button> */}
      </div>
      <div style={{display:"flex", alignItems:"flex-end", marginBottom:"10px"}}>
        <Button variant="contained" size="small" onClick={onSubmitClick} disabled={isSubmitting}>{isSubmitting ? "저장 중입니다." : "스케쥴 저장"}</Button>
        <p style={{marginLeft:"10px", fontSize:"12px"}}>*저장을 눌러야 변경사항들이 적용됩니다.</p>
      </div>


      <ul className={styles.color_container}>
        
        {calendar?.colorValues?.red &&
          <li className={styles.item_container}>
            <div className={`${styles.dot} ${styles.red}`} />
            <p className={`${styles.color_text} ${styles.red}`} >{calendar.colorValues.red}</p>
          </li>
        }
        {calendar?.colorValues?.yellow &&
          <li className={styles.item_container}>
            <div className={`${styles.dot} ${styles.yellow}`} />
            <p className={`${styles.color_text} ${styles.yellow}`} >{calendar.colorValues.yellow}</p>
          </li>
        }
        {calendar?.colorValues?.green &&
          <li className={styles.item_container}>
            <div className={`${styles.dot} ${styles.green}`} />
            <p className={`${styles.color_text} ${styles.green}`} >{calendar.colorValues.green}</p>
          </li>
        }
        {calendar?.colorValues?.blue &&
          <li className={styles.item_container}>
            <div className={`${styles.dot} ${styles.blue}`} />
            <p className={`${styles.color_text} ${styles.blue}`} >{calendar.colorValues.blue}</p>
          </li>
        }
        {calendar?.colorValues?.purple &&
          <li className={styles.item_container}>
            <div className={`${styles.dot} ${styles.purple}`} />
            <p className={`${styles.color_text} ${styles.purple}`} >{calendar.colorValues.purple}</p>
          </li>
        }


      </ul>
      <Calendar events={calendar.data} setEvents={setCalendar} editable={true}/>   
    </div>
  )
}
export default TeamSchedule