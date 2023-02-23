import { useEffect, useState } from "react"
import useData from "context/data"
import { useRouter } from "next/router"
import styles from "../styles/confirmProgram.module.css"
import { firestore as db } from "firebase/firebase"

const ConfirmProgram = () => {
  const {userData, teamId} = useData()
  const router = useRouter()
  const [files, setFiles] = useState([])

  useEffect(()=>{
    if(userData.roles[1]==="common"){
      alert("해당 페이지를 사용할 권한이 없습니다.\nhigh 이상의 관리자 권한이 필요합니다.")
      router.back()
    }
    const fetchData = async () => {
      let fileData = []
      const query = await db.collection("team").doc(teamId).collection("programs").where("condition","==", "waitingForConfirm").get()
      query.docs.forEach((doc) => {
        fileData.push({id: doc.id, data: doc.data()})
      })
      setFiles([...fileData])
    }
    fetchData()
  },[])

  const onFileClick = (id) => {
    router.push(`/${teamId}/editProgram/${id}`)
  }
  
  return(
    <>
      <div className={styles.content_container}>
        {files.map((item, index)=>{
          return(
            <div className={styles.item} key={index}>
              {/* <div className={styles.checkbox_container}>
                <Checkbox checked={files[index].checked || (backdropMode==="changeLocation" && selectedFiles.includes(item.id))} onChange={()=>onFilesCheckedChange(index)} size="small"/>
              </div> */}
              <div className={styles.condition} style={item.data.condition==="confirm" ? {color: "blue"} : item.data.condition==="decline" ? {color:"red"} : {color:"black"}}>
                {item.data.condition==="unconfirm" ? "미승인" : item.data.condition==="confirm" ? "승인" : item.data.condition==="decline" ? "반려" : "승인대기"}
              </div>
              <div className={styles.item_img_container} onClick={()=>onFileClick(item.id)}>
                <img src={item.data.thumbnailBg==="/custom" ? item.data.customBgURL : item.data.thumbnailBg} alt={item.data.title}/>
              </div>
              <p>{item.data.title}</p>
            </div>
          )
        })}
      </div>
    
    </>
  )
}
export default ConfirmProgram