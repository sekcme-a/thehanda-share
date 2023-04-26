import { useState, useEffect, useRef,  } from "react";
import useData from "context/data";
import { firestore as db } from "firebase/firebase";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import styles from "../styles/chatView.module.css"
import Image from "next/image";
import { sendNotification } from "src/public/hooks/notification";
import { CircularProgress } from "@mui/material";

const ChatView = ({uid, teamId, userName}) =>{
  const [dates, setDates] = useState([])
  const [input, setInput] = useState("")
  const {teamProfile, teamName} = useData()
  const [isShiftPress, setIsShiftPress] = useState(false)
  const messagesRef = useRef(null);
  const [isSending, setIsSending] = useState(false)
  useEffect(()=>{
    // setDates([
    //   {
    //     chats:[
    //       {text:"recen2t", type:"center", createdAt:"08:30"},
    //       {text:"previous2", type:"center", createdAt:"08:24"},
    //     ],
    //     date: new Date(),
    //     timeline: "2023.04.04"
    //   },
    // ])
    const dbRef = db.collection("team").doc(teamId).collection("message").doc(uid).collection("date").orderBy("date", "desc").limit(30)
    const unsubscribe = dbRef.onSnapshot((querySnapshot) => {
      if(!querySnapshot.empty){
        const data = querySnapshot.docs.map((doc)=>{
          return({
            ...doc.data(),
            timeline: doc.id
          })
        })
        setDates([...data.reverse(),])

        db.collection("team").doc(teamId).collection("message").doc(uid).update({
          unread: 0
        })

        setTimeout(()=>{
          const element = messagesRef.current;
          element.scrollTop = element.scrollHeight;
        },100)

      }
    })
    

    return () => {
      unsubscribe()
    }
  },[uid])

  const getYYYYMMDD = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // JavaScript months are 0-indexed, so we add 1
    const day = today.getDate();

    const formattedDate = `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`;
    return formattedDate
  }

  const getHHMM = () => {
    const now = new Date();
    let hours = now.getHours();
    console.log(hours)
    const amOrPm = hours >= 12 ? 'pm' : 'am'; // 오전/오후 구분
    hours = hours % 12 || 12; // 12시간제로 변환
    const minutes = now.getMinutes().toString().padStart(2, '0'); // 분을 가져와서 두 자리로 맞추고 앞에 0을 채움
    const time = `${amOrPm} ${hours}:${minutes}`; // 시간과 분을 결합하여 am/pm HH:MM 형태의 문자열 생성
    return time; // 예시 출력: "pm 03:30"
  }

  const onSubmit = async () => {
    const batch = db.batch()
    const YYYYMMDD = getYYYYMMDD()
    const HHMM = getHHMM()
    setIsSending(true)
    if(input.length>1000){
      alert("1000글자 이내이야 합니다.")
      return;
    }
    if(isSending)
      return

    //삭제된 사용자라면 alert뜨고 안보내지게
    const userDoc = await db.collection("user").doc(uid).get()
    if(!userDoc.exists){
      alert("삭제되거나 없는 사용자입니다.")
      setIsSending(false)
      return
    }
    
    if(dates[0]===undefined){
      batch.set(db.collection("team").doc(teamId).collection("message").doc(uid).collection("date").doc(YYYYMMDD), {
        date: new Date(),
        chats: [{text:input, type:"center", createdAt: HHMM}]
      })
    }
    else{
      //만약 같은 날짜가 아니라면 = 최근 톡 날짜 이후의 날짜가 된다면
      console.log(dates[dates.length-1])
      if(YYYYMMDD!==dates[dates.length-1]?.timeline){
        batch.set(db.collection("team").doc(teamId).collection("message").doc(uid).collection("date").doc(YYYYMMDD), {
          date: new Date(),
          chats: [{text:input, type:"center", createdAt: HHMM}]
        })
      } else{
        batch.set(db.collection("team").doc(teamId).collection("message").doc(uid).collection("date").doc(YYYYMMDD), {
          date: new Date(),
          chats: [...dates[dates.length-1].chats,{text:input, type:"center", createdAt: HHMM}]
        })
      }
    }


    //읽지 않음 count
    const messageDoc = await db.collection("user").doc(uid).collection("message").doc("status").get()
    if(messageDoc.exists){
      if(messageDoc.data().unread)
        batch.update(db.collection("user").doc(uid).collection("message").doc("status"), {unread: messageDoc.data().unread+1})
      else
        batch.update(db.collection("user").doc(uid).collection("message").doc("status"), {unread: 1})
    } else {
      batch.set(db.collection("user").doc(uid).collection("message").doc("status"), {unread: 1})
    }

    const doc = await db.collection("user").doc(uid).collection("message").doc(teamId).get()
    if(doc.exists){
      batch.set(db.collection("user").doc(uid).collection("message").doc(teamId),{
        repliedAt: new Date(),
        mode:"talk",
        title: teamName,
        content: input,
        unread: doc.data().unread+1,
        teamProfile: teamProfile
      })
    } else{
      batch.set(db.collection("user").doc(uid).collection("message").doc(teamId),{
        repliedAt: new Date(),
        mode:"talk",
        title: teamName,
        content: input,
        unread: 1,
        teamProfile: teamProfile
      })
    }

    //admin쪽 messagelist변경위해
    batch.set(db.collection("team").doc(teamId).collection("message").doc(uid), {
      repliedAt: new Date(),
      mode: "talk",
      title: userName,
      content: input,
      unread: 0,
    })

    batch.commit().then( async()=>{
      //push notification
      try{
        const userDoc = await db.collection("user").doc(uid).get()
        const result = await sendNotification(userDoc.data().pushToken,teamName,input);
        setIsSending(false)
        setInput("")
      }catch(e){
        setIsSending(false)
        console.log(e.message)
      }
    })



  }

  const handleOnKeyPress = (e) => {
    console.log(e.key)
    let shiftPress = isShiftPress
    if (e.key==="Shift"){
      setIsShiftPress(true)
      shiftPress=true
    }

    if (e.key === "Enter" && !shiftPress) {
      onSubmit()
    }
  }
  const handleKeyUp = (e) => {
    if(e.key==="Shift")
      setIsShiftPress(false)
  }


  return(
    <div className={styles.main_container}>
      <div className={styles.chat_container} ref={messagesRef}>
        {dates.length===0 && <p className={styles.no_chat}>아직 채팅 내역이 없습니다.</p>}
        {dates.map((date)=>{
          return(
            <ul key={date.timeline}>
              <h1>{date.timeline}</h1>

              
                {date.chats.map((chat, index)=>{
                  if(chat.type==="center")
                    return(
                      <div className={`${styles.text_container} ${styles.my_text}`}>
                        <p>{chat.createdAt}</p>
                        <li key={index}>
                          <h4>{chat.text}</h4>
                        </li>
                      </div>
                    )
                  else
                    return(
                      <div className={`${styles.text_container} ${styles.other_text}`}>
                        
                        <li key={index}>
                          <h4>{chat.text}</h4>
                        </li>
                        <p>{chat.createdAt}</p>
                      </div>
                    )
                })}
             
            </ul>
          )
        })}
      </div>

      <div className={styles.input_container}>
        <TextField sx={{minHeight:"20px"}} multiline
          value={input} onChange={e=>{console.log(e.target.value);setInput(e.target.value)}}
          fullWidth size="small" maxRows={4}
          onKeyDown={handleOnKeyPress}
          onKeyUp={handleKeyUp}
          disabled={isSending}
          />
        <Button variant="contained" sx={{ minWidth:"40px", ml:"10px"}} onClick={onSubmit}>
          {isSending ?
            <CircularProgress size={20} sx={{color:"white"}}/>
          : 
            <ArrowUpwardOutlinedIcon sx={{fontSize:"20px"}}/>
          }
        </Button>
      </div>
    </div>
  )
}

export default ChatView