import { useEffect, useState } from "react"
import { useRouter } from "next/router";
import styles from "src/[team_id]/index.module.css"

import useData from "context/data";

import { firestore as db } from "firebase/firebase";

import NoAuthority from "src/[team_id]/index/components/NoAuthority"
import LoaderGif from "src/public/components/LoaderGif"
import Navbar from "src/public/components/Navbar"
import Header from "src/public/components/Header"

import ManageTeam from "src/[team_id]/manageTeam/components/ManageTeam"
import AccountSettings from "src/[team_id]/profile/components/AccountSettings";
import UserList from "src/[team_id]/userList/components/UserList"
import UserProfileSettings from "src/[team_id]/userProfileSettings/components/UserProfileSettings"
import Program from "src/[team_id]/program/components/Program"
import Survey from "src/[team_id]/survey/components/Survey"
import Anouncement from "src/[team_id]/anouncement/components/Anouncement"
import ConfirmProgram from "src/[team_id]/confirmProgram/components/ConfirmProgram"
import ConfirmSurvey from "src/[team_id]/confirmSurvey/components/ConfirmSurvey"
import ConfirmAnouncement from "src/[team_id]/confirmAnouncement/components/ConfirmAnouncement"

import SubContent from "src/public/subcontent/components/SubContent"

const Index = () => {
    const router = useRouter()
    const {slug, team_id} = router.query
    const {userData, setTeamId, setTeamName, subContent} = useData()
    const [isLoading, setIsLoading] = useState(true)    
    const [isTeamName, setIsTeamName] = useState(false)

    useEffect(()=>{
        const fetchData = async() => {
            setTeamId(team_id)
            localStorage.setItem("teamId", team_id)
            const doc = await db.collection("team_admin").doc(team_id).get()
            setIsTeamName(doc.exists)
            if(doc.exists)
                setTeamName(doc.data().teamName)
            setIsLoading(false)
        }
        if(userData)
            fetchData()
        else
            router.push("/")
    },[userData])

    if(isLoading)
        return(<LoaderGif />)


    if(userData?.roles[0]!==`admin_${team_id}`)
        return(<NoAuthority uid={userData?.uid} teamName={team_id} isTeamName={isTeamName}/>)

    return(
        <div className={styles.main_container}>
        <Header location={slug}/>
        <div className={styles.body_container}>
          <Navbar />
          <div className={styles.content_container}>
            {
                slug === "home" ? <ManageTeam /> :
                slug === "profile" ? <AccountSettings /> :
                slug === "manageTeam" ? <ManageTeam /> :
                slug==="userList" ? <UserList /> :
                slug==="userProfileSettings" ? <UserProfileSettings /> :
                slug === "program" ? <Program /> :
                // slug === "alarmSettings" ? <AlarmSettings /> :
                slug==="survey" ? <Survey /> : 
                slug==="anouncement" ? <Anouncement /> :
                slug==="confirmProgram" ? <ConfirmProgram /> : 
                slug==="confirmSurvey" ? <ConfirmSurvey /> : 
                slug==="confirmAnouncement" ? <ConfirmAnouncement /> : 
                <></>
            }
          </div>
          <div className={styles.sub_content_container}>
            <SubContent />
          </div>
        </div>
      </div>
    )
}


const main_container = {
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: "rgb(250,250,250)"
}

const content_container = {
    minHeight: "600px",
    width: "100%",
    marginTop: "70px",
    marginLeft: "290px",
    marginBottom: "60px",
    marginRight: "40px"
}

export default Index