import styles from "../styles/subContent.module.css"
import useData from "context/data"

import ProgramInfo from "./ProgramInfo"
import SurveyInfo from "./SurveyInfo"
import AnouncementInfo from "./AnouncementInfo"

const SubContent = () => {
  const {subContent} = useData()

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
    </div>
  )
}
export default SubContent