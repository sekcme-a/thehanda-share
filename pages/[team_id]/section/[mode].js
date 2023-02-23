import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useData from "context/data"
import Header from "src/public/components/Header"
import Navbar from "src/public/components/Navbar"
import styles from "src/[team_id]/index.module.css"
import PageHeader from "src/public/components/PageHeader";
import SectionCompo from "src/[team_id]/section/components/Section"
import NoAuthority from "src/[team_id]/index/components/NoAuthority";
import LoaderGif from "src/public/components/LoaderGif";

const Section = () => {
  const router = useRouter()
  const {team_id, mode} = router.query
  const {userData, setTeamId, teamId} = useData()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const fetchData = async() => {
      setTeamId(team_id) 
      console.log(userData)
      setIsLoading(false)
    }
    if(userData && userData.roles[0]===`admin_${team_id}`&& (userData.roles[1]==="super"||userData.roles[1]==="high"))
      fetchData()
    else
      router.push(`/${team_id}/home`)
  },[])

  if(isLoading)
    return<LoaderGif />
  if(userData?.roles[0]!==`admin_${team_id}`)
    return(<NoAuthority uid={userData?.uid} teamName={team_id} isTeamName={isTeamName}/>)

  return(
    <>
      <div className={styles.main_container}>
        <Header location="section"/>
        <div className={styles.body_container}>
          <Navbar />
          <div className={styles.content_container}>
            {userData?.roles[1]!=="super" && userData?.roles[1]!=="high" ? <PageHeader title="해당 페이지에 접근 권한이 없습니다." subtitle="high 등급 이상의 관리자 권한이 필요합니다."/> : 
              <>
                <PageHeader title="섹션 관리" subtitle="섹션을 추가/삭제/순서변경 할 수 있습니다." mt="20px"/>
                <SectionCompo mode={mode}/>
              </>
            }     
            
          </div>
          <div className={styles.sub_content_container}>

          </div>
        </div>
      </div>
    </>
  )
}

export default Section