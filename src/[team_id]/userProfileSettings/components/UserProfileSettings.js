import { useState, useEffect } from "react";
import styles from "../styles/userProfileSettings.module.css"
import { firebaseHooks } from "firebase/hooks";
import useData from "context/data";

import PageHeader from "src/public/components/PageHeader"
import CustomForm from "src/[team_id]/userProfileSettings/components/CustomForm"
import AlertComponent from "src/public/components/Alert"
import LoaderGif from "src/public/components/LoaderGif"
  

import Button from '@mui/material/Button'


const UserProfileSettings = () => {
  const [mainFormData, setMainFormData] = useState([])
  const [subFormData, setSubFormData] = useState([])
  const [controlAlert, setControlAlert] = useState({
    isShow: false,
    mode: "success",
    text: ""
  })
  const [isLoading, setIsLoading] = useState(true)
  const {teamId} = useData()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await firebaseHooks.get_user_profile_setting_data(teamId)
        if (result) {
          console.log(result)
          setMainFormData(result)
          // setSubFormData(result.sub)
        }
        setIsLoading(false)
      } catch (e) {
        console.log(e)
      }
      
    }
    fetchData()
  },[])

  const onSubmitClick = async() => {
    const result = await firebaseHooks.set_user_profile_setting_data(mainFormData, teamId)
    if (result === "success") {
      setControlAlert({...controlAlert, isShow: true, mode: "success", text:"성공적으로 적용되었습니다."})
      setTimeout(() => {
        setControlAlert({...controlAlert, isShow: false})
      },2000)
    }
    else {
      setControlAlert({ ...controlAlert, isShow: true, mode: "error", text: `적용 실패 : ${result}` })
      console.log(result)
      setTimeout(() => {
        setControlAlert({...controlAlert, isShow: false})
      },2000)
    }
  }

  if(isLoading) return <LoaderGif />
  return (
    <div className={styles.main_container}>
      <div style={{display: "flex", flexWrap:"wrap",width:"100%", alignItems:"center", justifyContent:"space-between"}}>
        <div style={{width:"50%"}}>
          <PageHeader title="사용자 프로필 설정" subtitle="사용자가 입력가능한 프로필 정보를 설정하세요. " mt="10px" height="30px" />
          <PageHeader subtitle="마우스를 아이템에 누르고 있으면 위치를 이동시킬 수 있습니다." mt="-10px" height="30px" />
        </div>
        <div>
          <Button variant="contained" style={{backgroundColor: "purple", fontWeight: "bold"}} onClick={onSubmitClick}>적 용</Button>
        </div>
      </div>
      <CustomForm formData={mainFormData} setFormData={setMainFormData} teamName={teamId} />
       <AlertComponent control={controlAlert} />
    </div>
  )
}
export default UserProfileSettings