import { useEffect, useState } from "react"
import styles from "src/public/styles/header.module.css"
import Image from "next/image";
import useData from "context/data";
import { firestore as db } from "firebase/firebase";

import AvatarWithMenu from "src/public/components/AvatarWithMenu"


const Header = (props) => {
  const [title, setTitle] = useState("")
  const [photo, setPhoto] = useState("")

  const { userData, teamId } = useData()
  useEffect(() => {
    if (props.location === "home")
      setTitle("메인페이지")
    else if(props.location === "profile")
      setTitle("프로필 설정")
    else if (props.location === "manageTeam")
      setTitle("팀 관리")
    else if(props.location==="userList")
      setTitle("사용자 목록")
    else if (props.location === "userProfileSettings")
      setTitle("사용자 프로필 설정")
    else if (props.location === "alarmSettings")
      setTitle("알람 타입 설정")
    else if (props.location === "user")
      setTitle("사용자 프로필")
    else if (props.location === "program")
      setTitle("프로그램 관리")
    else if (props.location === "survey")
      setTitle("설문조사 관리")
    else if (props.location === "content")
      setTitle("컨텐츠 관리")
    else if (props.location === "anouncement")
      setTitle("공지사항 관리")
    else if (props.location === "result")
      setTitle("결과 보기")
    else if (props.location === "programSurvey")
      setTitle("프로그램 설문조사 제작")
    else if (props.location === "editProgram")
      setTitle("프로그램 편집")
    else if (props.location === "editSurvey")
      setTitle("설문조사 편집")
    else if (props.location === "section")
      setTitle("섹션 관리")
    else if (props.location==="confirmProgram")
      setTitle("프로그램 승인 관리")
    else if (props.location==="confirmSurvey")
      setTitle("설문조사 승인 관리")
    else if (props.location==="programCondition")
      setTitle("프로그램 현황")
    else if (props.location==="contact")
      setTitle("센터문의 관리")
    else if (props.location==="teamProfile")
      setTitle("팀 프로필")
    else if (props.location==="chat")
      setTitle("메세지 채팅")
    else if (props.location==="teamSchedule")
      setTitle("팀 스케줄")
    else if (props.location==="alarmType")
      setTitle("알람 타입 설정")
    db.collection("user").doc(userData.uid).get().then((doc) => {
      setPhoto(doc.data().photoUrl)
    })
  }, [props])
  const uppercase = (text) => {
    return text?.charAt(0).toUpperCase() + text.slice(1)
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.header}>
        <Image src="/logo_2zsoft_no_text.png" width={60} height={45} alt="logo" />
        <div style={{marginLeft: "10px"}}>
          <h1>Admin Team </h1>
          <h2>{uppercase(teamId)}</h2>
        </div>
      </div>
      <div className={styles.title}>
        <h1>{title}</h1>
      </div>
      <div className={styles.avatar}>
        <h1>{userData.displayName}</h1>
        <AvatarWithMenu photo={photo}  />
      </div>
    </div>
  )
}
export default Header