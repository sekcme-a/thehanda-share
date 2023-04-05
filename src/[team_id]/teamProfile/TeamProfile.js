import { useEffect, useState } from "react"
import { firestore as db } from "firebase/firebase"
import useData from "context/data"
import styles from "./teamProfile.module.css"
import Image from "next/image"
import DropperImage from "src/[team_id]/editProgram/components/DropperImage"
import { TextField } from "@mui/material"
import { Button } from "@mui/material"
import { CircularProgress } from "@mui/material"

const TeamProfile = () => {
  const {teamProfile, setTeamProfile, teamName, setTeamName, teamId} = useData()
  const [name, setName] = useState(teamName)
  const [profile, setProfile] = useState(teamProfile)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(()=>{
    console.log(teamProfile, teamName)
  },[])

  const handleTeamProfileChange = (url) => {
    db.collection("team").doc(teamId).update({
      profile: url
    }).then(()=>{
      setProfile(url)
    })
  }

  const onSubmitClick = () => {
    if(name.length>10){
      alert("팀명은 10글자 이내여야 합니다.")
      return;
    }
    setIsSubmitting(true)
    const batch = db.batch()
    batch.update(db.collection("team").doc(teamId),{
      teamName: name,
      profile: profile
    })
    batch.update(db.collection("team_admin").doc(teamId),{
      teamName: name
    })
    batch.commit().then(()=>{
      setTeamName(name)
      setTeamProfile(profile)
      setIsSubmitting(false)
      alert("적용되었습니다.")
    })

  }

  
  return(
    <>
      <div className={styles.main_container}>
        <div className={styles.profile_container}>
          <h1>현재 프로필 사진</h1>
          <Image src={profile} width={150} height={150} alt="팀 프로필"/>

          <h1>팀 프로필 사진 변경</h1>
          <p>*가로 세로 사이즈가 동일한 정사각형 이미지 사용을 권장합니다.</p>
          <DropperImage imgURL={profile} setImgURL={handleTeamProfileChange} path={`content/${teamId}/profile`}>
            
          </DropperImage>

          <h1>팀명 변경</h1>
          <p style={{marginBottom:"10px"}}>*팀명은 10글자 이하여야 합니다.</p>
          <TextField value={name} onChange={e=>setName(e.target.value)} size="small"/>
        </div>
        <div className={styles.button_container}>
          {isSubmitting ? <CircularProgress />: <Button variant="contained" onClick={onSubmitClick}>적용</Button>}
        </div>
      </div>
    </>
  )
}

export default TeamProfile