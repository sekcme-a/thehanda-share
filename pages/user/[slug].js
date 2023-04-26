import { useEffect, useState } from "react"
import { useRouter } from "next/router";
import styles from "src/[team_id]/index.module.css"
import Image from "next/image";

import useData from "context/data";

import { firestore as db } from "firebase/firebase";

import LoaderGif from "src/public/components/LoaderGif"
import Navbar from "src/public/components/Navbar"
import Header from "src/public/components/Header"
import { firebaseHooks } from "firebase/hooks";
import UserViewLeft from "src/user/components/UserViewLeft";
import UserViewRight from "src/user/components/UserViewRight"

import Grid from '@mui/material/Grid'
import SubContent from "src/public/subcontent/components/SubContent"
 

const User = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { user, userrole, setUserrole,teamName, setTeamId,teamId } = useData();
  const [datas, setDatas] = useState({
    user_data: "",
    user_additional_data: "",
    profile_settings: ""
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      if(localStorage.getItem("teamId")===null){
        alert("정상적인 경로로 진입해주세요.")
        router.push("/")
      }
      setTeamId(localStorage.getItem("teamId"))
      console.log(localStorage.getItem("teamId"))
      const user_data = await firebaseHooks.fetch_user_profile(slug)
      const user_additional_data = await firebaseHooks.fetch_additional_profile_as_array(slug, localStorage.getItem("teamId"))
      const profile_settings = await firebaseHooks.fetch_profile_settings_object(localStorage.getItem("teamId"))
      setDatas({ ...datas, user_data: user_data, user_additional_data: user_additional_data, profile_settings: profile_settings})
      setIsLoading(false)
      console.log(user_data)
    }

    if(user && slug)
      fetchData()
  }, [slug])

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
      <Header location={slug}/>
      <div className={styles.body_container}>
        <Navbar />
        <div className={styles.content_container}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5} lg={4}>
              <UserViewLeft data={datas.user_data} />
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
              <UserViewRight profile_settings={datas.profile_settings} additional_data={datas.user_additional_data} uid={slug} userData={datas.user_data} />
            </Grid>
          </Grid>
        </div>
      <div className={styles.sub_content_container}>
        <SubContent />
      </div>
    </div>
  </div>
  )
}

export default User