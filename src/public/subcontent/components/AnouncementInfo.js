import { useEffect, useState } from "react"
import styles from "../styles/subContent.module.css"
import { firestore as db } from "firebase/firebase"
import { CircularProgress } from "@mui/material"
import useData from "context/data"
import { Button } from "@mui/material"
import { useRouter } from "next/router"

const SurveyInfo = ({subContent}) => {
  const {teamId, setSubContent} = useData()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState()
  const router = useRouter()

  useEffect(()=>{
    const fetchData = async () => {
      const doc = await db.collection("team").doc(teamId).collection(subContent.type).doc(subContent.id).get()
      if(doc.exists)
        setData(doc.data())
      setIsLoading(false)
    }
    fetchData()
  })

  const onEditClick = () => {
    setSubContent({type:"surveyLog", id: subContent.id})
    router.push(`/${teamId}/editAnouncement/${subContent.id}`)
  }

  const onResultClick = () => {
    setSubContent({type:"resultLog", id: subContent.id})
    router.push(`/${teamId}/result/${subContent.type}/${subContent.id}`)
  }

  if(isLoading)
    return(
      <div className={styles.loading}><CircularProgress />  </div>
    )
  return(
    <div className={styles.program_info_container}>
      <h1>제목: {data.title}</h1>
      <h1>부제목: {data.subtitle}</h1>
      {/* <div className={styles.border} /> */}
      <h1>상태:    
        {data.condition==="unconfirm" && " 미승인"}
        {data.condition==="confirm" && data.publishStartDate > new Date() && " 예약게재"}
        {data.condition==="confirm" && data.publishStartDate <= new Date() && " 게재중"}
        {data.condition==="decline" && " 반려"}
        {data.condition==="waitingForConfirm" && " 승인대기"}
      </h1>
      {data.condition==="confirm" && <h1>게제일: {data.publishStartDate.toDate().toLocaleString()}</h1>}

      <Button fullWidth variant="contained" style={{fontSize:"16px", paddingTop:'0px', paddingBottom:"0px", marginTop: "30px"}} size="small" onClick={onEditClick}>편 집</Button>
    </div>
  )
}

export default SurveyInfo