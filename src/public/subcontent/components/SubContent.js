import styles from "../styles/subContent.module.css"
import useData from "context/data"
import { useEffect } from "react"

import ProgramInfo from "./ProgramInfo"
import SurveyInfo from "./SurveyInfo"
import AnouncementInfo from "./AnouncementInfo"
import ProgramEdit from "./ProgramEdit"
import SurveyEdit from "./SurveyEdit"
import AddSchedule from "./AddSchedule"
import AddProgramSchedule from "./AddProgramSchedule"
const SubContent = () => {
  const {subContent} = useData()
  
  useEffect(()=>{
    console.log(subContent)
  },[subContent])

  return(
    <div className={styles.main_container}>
      {subContent.type==="programs" &&
        <ProgramInfo subContent={subContent}/>
      }
      {subContent.type==="surveys" &&
        <SurveyInfo subContent={subContent}/>
      }
      {subContent.type==="anouncements" &&
        <AnouncementInfo subContent={subContent}/>
      }
      {subContent.type === "programEdit" &&
        <ProgramEdit subContent={subContent} />
      }
      {subContent.type === "surveyEdit" &&
        <SurveyEdit subContent={subContent} />
      }
      {subContent.type === "teamSchedule" &&
        <AddSchedule subContent={subContent} scheduleFor="teamSchedule" />
      }
      {subContent.type === "programSchedule" &&
        <AddProgramSchedule subContent={subContent} scheduleFor="programSchedule" />
      }
    </div>
  )
}
export default SubContent