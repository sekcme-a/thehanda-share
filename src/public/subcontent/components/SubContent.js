import styles from "../styles/subContent.module.css"
import useData from "context/data"
import { useEffect } from "react"

import ProgramInfo from "./ProgramInfo"
import SurveyInfo from "./SurveyInfo"
import AnouncementInfo from "./AnouncementInfo"
import ProgramEdit from "./ProgramEdit"

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
    </div>
  )
}
export default SubContent