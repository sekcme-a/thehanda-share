import { useEffect, useState } from "react"
import styles from "../styles/subContent.module.css"
import { firestore as db } from "firebase/firebase"
import { CircularProgress } from "@mui/material"
import useData from "context/data"
import { Button } from "@mui/material"
import { useRouter } from "next/router"
import QRCodeGenerator from "src/public/components/QRCodeGenerator"
import History from "./History"

const ProgramEdit = ({subContent}) => {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const {teamId} = useData()
  const [data, setData] = useState()
  const [isHistoryDetail, setIsHistoryDetail] = useState(false)

  useEffect(()=>{
    const fetchData = async () => {
      const doc = await db.collection("team").doc(teamId).collection("programs").doc(subContent.id).get()
      if(doc.exists)
        setData(doc.data())
        

      setIsLoading(false)
    }
    fetchData()
  },[])


  if(isLoading)
    return(
      <div className={styles.loading}><CircularProgress />  </div>
    )

  return(
    <div className={styles.program_info_container}>
      {/* <QRCodeGenerator url={`https://dahanda.netlify.app/test/${subContent.id}`}/> */}
      <h1>미리보기 QR 코드<br/><p style={{fontSize:"13px"}}>{`(저장 후 미리볼 수 있습니다.)`}</p></h1>
      <div style={{width:"100%", display:"flex", justifyContent:"center"}}>
        <QRCodeGenerator url={`https://dahanda.netlify.app/test/article/${teamId}/${subContent.id}`}/>
      </div>
      {data && <History data={data.history} />}
    </div>
  )
}

export default ProgramEdit