import { useEffect, useState } from "react"
import { useRouter } from "next/router";
import styles from "src/content/programs/styles/index.module.css"
import Image from "next/image";

import useData from "context/data";

import { firestore as db } from "firebase/firebase";

import NoAuthority from "src/[team_id]/index/components/NoAuthority";

import LoaderGif from "src/public/components/LoaderGif"
import Navbar from "src/public/components/Navbar"
import Header from "src/public/components/Header"

import Stepper from "src/content/programs/components/Stepper"



const User = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { user, userData, teamName, teamId, setTeamId } = useData();
  const [datas, setDatas] = useState({
    user_data: "",
    user_additional_data: "",
    profile_settings: ""
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const tid = localStorage.getItem("teamId")
      if(tid===null){
        alert("정상경로로 진입해주세요.")
        router.push("/")
      }
      setTeamId(tid)
      setIsLoading(false)
    }

    if(user && slug)
      fetchData()
  }, [])

  // const noAuthority = () => {
  //   return <NoAuthority uid={user.uid} teamName={team_name} isTeamName={isTeamName} />
  // }


  if (isLoading)
    return (
      <LoaderGif mode="background"/>
    )
  
  // if (!userrole?.includes(`admin_${team_name}`) && !userrole?.includes("super_admin"))
  //   return noAuthority()

  return (
    <div className={styles.main_container}>
      <Navbar teamName={teamName} />
      <Header location="content" />
      <div className={styles.content_container}>
        <Stepper id={slug} teamName={teamId} type="anouncements"/>
      </div>
    </div>
  )
}

export default User