import { useEffect, useState } from "react"
import useData from "context/data"
import { useRouter } from "next/router"
// import styles from "../styles/confirmAnouncement.module.css"
import { firestore as db } from "firebase/firebase"
import { Checkbox } from "@mui/material"
import styles from "../styles/programCondition.module.css"


const ProgramCondition = () => {
  const [mainList, setMainList] = useState([])
  const [beforeDeadlineList, setBeforeDeadlineList] = useState([])
  const [publishStartSoonList, setPublishStartSoonList] = useState([])
  const {setSubContent, teamId} = useData()
  const [date, setDate] = useState(new Date())
  
  useEffect(()=>{
    const fetchData = async() => {
      const querySnapshot = await db.collection("team").doc(teamId).collection("programs").where("condition","==","confirm").where("deadline", ">", new Date()).orderBy("deadline", "desc").get()
      const tempList = querySnapshot.docs.map((doc)=>({id: doc.id, data:doc.data()}))
      setBeforeDeadlineList([...tempList])

      const querySnapshot2 = await db.collection("team").doc(teamId).collection("programs").where("condition","==","confirm").where("programStartDate",">", new Date()).get()
      const tempList2 = querySnapshot2.docs.map((doc)=>{
        if((doc.data().programStartDate.toDate().getTime()-new Date().getTime())<432000000)
          return({id: doc.id, data: doc.data()})
      }).filter(Boolean) 
      console.log(tempList2)
      setPublishStartSoonList([...tempList2])
      
      const querySnapshot3 = await db.collection("team").doc(teamId).collection("programs").where("isMain","==",true).get()
      const tempList3 = querySnapshot3.docs.map((doc)=>{
        console.log(doc.data().condition)
        if(doc.data().condition==="confirm")
          return ({id: doc.id, data:doc.data()})
      }).filter(Boolean)
      console.log(tempList3)
      setMainList([...tempList3])
    }
    fetchData()
  },[])

  useEffect(()=>{
    setInterval(()=>setDate( new Date()), 1000)
  },[])

  const getDeadlineLeft = (data) => {
    const timeLeft = Math.round((data.deadline.toDate().getTime() - date.getTime()) / 1000);
  
    if (timeLeft <= 0) {
      return '마감되었습니다';
    } else if (timeLeft <= 60) {
      return `${timeLeft}초 후 마감됨`;
    } else if (timeLeft <= 60 * 60) {
      const minutesLeft = Math.floor(timeLeft / 60);
      return `${minutesLeft}분 후 마감됨`;
    } else if (timeLeft <= 60 * 60 * 24) {
      const hoursLeft = Math.floor(timeLeft / (60 * 60));
      const minutesLeft = Math.floor((timeLeft % (60 * 60)) / 60);
      return `${hoursLeft}시간 ${minutesLeft}분 후 마감됨`;
    } else {
      const daysLeft = Math.floor(timeLeft / (60 * 60 * 24));
      return `${daysLeft}일 후 마감됨`;
    }
  };

  const getStartDateLeft = (data) => {
    const timeLeft = Math.round((data.programStartDate.toDate().getTime() - date.getTime()) / 1000);
  
    if (timeLeft <= 0) {
      return '프로그램 종료';
    } else if (timeLeft <= 60) {
      return `시작까지 ${timeLeft}초`;
    } else if (timeLeft <= 60 * 60) {
      const minutesLeft = Math.floor(timeLeft / 60);
      return `시작까지 ${minutesLeft}분 `;
    } else if (timeLeft <= 60 * 60 * 24) {
      const hoursLeft = Math.floor(timeLeft / (60 * 60));
      const minutesLeft = Math.floor((timeLeft % (60 * 60)) / 60);
      return `시작까지 ${hoursLeft}시간 ${minutesLeft}분`;
    } else {
      const daysLeft = Math.floor(timeLeft / (60 * 60 * 24));
      const hoursLeft = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));
      return `시작까지 ${daysLeft}일 ${hoursLeft}시간`;
    }
    
  };
  

  const onFileClick = (id) => {
    // router.push(`/${teamId}/editProgram/${id}`)
    setSubContent({type:"programs", id: id})
  }
  return(
    <>
      <h1>메인 프로그램</h1>
      <div className={styles.content_container}>
        {mainList.length===0 &&
          <h2>아직 메인 프로그램이 없습니다.</h2>
        }
        {mainList.map((item, index)=>{
          return(
            <div className={styles.item} key={index}>
              <div className={styles.checkbox_container}>
                {/* <Checkbox checked={files[index].checked || (backdropMode==="changeLocation" && selectedFiles.includes(item.id))} onChange={()=>onFilesCheckedChange(index)} size="small"/> */}
              </div>
              <div className={styles.condition} style={item.data.condition==="confirm" ? {color: "blue"} : item.data.condition==="decline" ? {color:"red"} : {color:"black"}}>
                {/* {item.data.condition==="unconfirm" ? "미승인" : item.data.condition==="confirm" ? "승인" : item.data.condition==="decline" ? "반려" : "승인대기"} */}
                {item.data.condition==="unconfirm" && "미승인"}
                {item.data.condition==="confirm" && item.data.publishStartDate > new Date() && "예약게재"}
                {item.data.condition==="confirm" && item.data.publishStartDate <= new Date() && "게재중"}
                {item.data.condition==="decline" && "반려"}
                {item.data.condition==="waitingForConfirm" && "승인대기"}
              </div>
              <div className={styles.item_img_container} onClick={()=>onFileClick(item.id)}>
                <img src={item.data.thumbnailBg==="/custom" ? item.data.customBgURL : item.data.thumbnailBg} alt={item.data.title}/>
              </div>
              <p >{item.data.title}</p>
            </div>
          )
        })}
  
      </div>


      <h1 style={{marginTop:"90px"}}>게재중 & 마감전 프로그램</h1>
      <div className={styles.content_container}>
        {beforeDeadlineList.length===0 &&
            <h2>아직 게재중 & 마감전 프로그램이 없습니다.</h2>
        }
        {beforeDeadlineList.map((item, index)=>{
          return(
            <div className={styles.item} key={index}>
              <div className={styles.checkbox_container}>
                {/* <Checkbox checked={files[index].checked || (backdropMode==="changeLocation" && selectedFiles.includes(item.id))} onChange={()=>onFilesCheckedChange(index)} size="small"/> */}
              </div>
              <div className={styles.condition} style={item.data.condition==="confirm" ? {color: "blue"} : item.data.condition==="decline" ? {color:"red"} : {color:"black"}}>
                {/* {item.data.condition==="unconfirm" ? "미승인" : item.data.condition==="confirm" ? "승인" : item.data.condition==="decline" ? "반려" : "승인대기"} */}
                {item.data.condition==="unconfirm" && "미승인"}
                {item.data.condition==="confirm" && item.data.publishStartDate > new Date() && "예약게재"}
                {item.data.condition==="confirm" && item.data.publishStartDate <= new Date() && "게재중"}
                {item.data.condition==="decline" && "반려"}
                {item.data.condition==="waitingForConfirm" && "승인대기"}
              </div>
              <div className={styles.item_img_container} onClick={()=>onFileClick(item.id)}>
                <img src={item.data.thumbnailBg==="/custom" ? item.data.customBgURL : item.data.thumbnailBg} alt={item.data.title}/>
              </div>
              <p >{item.data.title}</p>
              <p style={{paddingTop:"3px"}}>{getDeadlineLeft(item.data)}</p>
            </div>
          )
        })}
  
      </div>


      <h1 style={{marginTop:"90px"}}>프로그램 시작일 임박 프로그램</h1>
      <div className={styles.content_container}>
        {publishStartSoonList.length===0 &&
          <h2>아직 시작일 임박 프로그램이 없습니다.</h2>
        }
        {publishStartSoonList.map((item, index)=>{
          return(
            <div className={styles.item} key={index}>
              <div className={styles.checkbox_container}>
                {/* <Checkbox checked={files[index].checked || (backdropMode==="changeLocation" && selectedFiles.includes(item.id))} onChange={()=>onFilesCheckedChange(index)} size="small"/> */}
              </div>
              <div className={styles.condition} style={item.data.condition==="confirm" ? {color: "blue"} : item.data.condition==="decline" ? {color:"red"} : {color:"black"}}>
                {/* {item.data.condition==="unconfirm" ? "미승인" : item.data.condition==="confirm" ? "승인" : item.data.condition==="decline" ? "반려" : "승인대기"} */}
                {item.data.condition==="unconfirm" && "미승인"}
                {item.data.condition==="confirm" && item.data.publishStartDate > new Date() && "예약게재"}
                {item.data.condition==="confirm" && item.data.publishStartDate <= new Date() && "게재중"}
                {item.data.condition==="decline" && "반려"}
                {item.data.condition==="waitingForConfirm" && "승인대기"}
              </div>
              <div className={styles.item_img_container} onClick={()=>onFileClick(item.id)}>
                <img src={item.data.thumbnailBg==="/custom" ? item.data.customBgURL : item.data.thumbnailBg} alt={item.data.title}/>
              </div>
              <p >{item.data.title}</p>
              <p style={{paddingTop:"3px"}}>{getStartDateLeft(item.data)}</p>
            </div>
          )
        })}
  
      </div>
    </>
  )
}
export default ProgramCondition