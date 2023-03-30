import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { firestore as db } from "firebase/firebase"
import useData from "context/data"
import Stepper from "src/[team_id]/editProgram/components/Stepper"
import Header from "src/public/components/Header"
import Navbar from "src/public/components/Navbar"
import styles from "src/[team_id]/index.module.css"
import EditPost from "src/[team_id]/editProgram/components/EditPost"
import NoAuthority from "src/[team_id]/index/components/NoAuthority"
import LoaderGif from "src/public/components/LoaderGif"
import CustomForm from "src/[team_id]/editProgram/components/CustomForm"

import { Button } from "@mui/material"
import { MobileDateTimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from "@mui/material"
import { CellphoneMessageOff } from "mdi-material-ui"
import { Switch } from "@mui/material"
import { Backdrop } from "@mui/material"
import Form from "src/form/Form"
import Article from "src/article/components/Article"
import SubContent from "src/public/subcontent/components/SubContent"

import axios from "axios"
import { sendNotification } from "src/public/hooks/notification"
//stepper
const data = [
  "게시물 작성",
  "폼 작성",
  "저장 및 게재",
]

const EditProgram = () => {
  const router = useRouter()
  const {team_id, file_id} = router.query
  const {userData, setTeamId, teamId, setSubContent} = useData()

  const [step, setStep] = useState(0)

  const handleStep = (num) => {setStep(num)}

  const [postValues, setPostValues] = useState({
    isMain: false,
    condition: "unconfirm",
    history: [],
    author: userData.uid,
    team: [userData.uid],
    type: "common",
    sections: [],
    title: "",
    subtitle: "",
    mainBg: "",
    thumbnailBg: "",
    customBgURL:"",
    info:[],
    introduce: [],
    schedule: [],
    formData: [],
    deadline: undefined,
    programStartDate: new Date(),
    publishStartDate: new Date(),
    hasLimit: false,
    limit: "0",
  })
  const [sections, setSections] = useState([])
  const [rejectText, setRejectText] = useState("")
  const [openBackdrop, setOpenBackdrop] = useState(false)

  const [isSendAlarm, setIsSendAlarm] = useState(true)
  const [alarmText, setAlarmText] = useState("")

  const [isLoading, setIsLoading] = useState(true)

  // const onValuesChangeWithEvent = (event, type) => {
  //   setPostValues({...postValues, ["type"]: event.target.value})
  // }

  useEffect(()=>{
    setSubContent({
      id: file_id,
      type: "programEdit"
    })
  },[postValues])


  useEffect(()=>{
    const fetchData = async () => {
      setTeamId(team_id)
      const sectionDoc = await db.collection("team").doc(team_id).collection("section").doc("program").get()
      if(sectionDoc.exists)
        setSections(sectionDoc.data().data)
      else{
        alert("아직 섹션이 없습니다. 프로그램 섹션을 1개 이상 추가한 후 다시 시도해주세요.")
        router.push(`/${team_id}/section/program`)
      }
      
      const postDoc = await db.collection("team").doc(team_id).collection("programs").doc(file_id).get()
      if(postDoc.exists){
        setPostValues({...postDoc.data(),
          deadline: postDoc.data().deadline?.toDate(),
          programStartDate: postDoc.data().programStartDate?.toDate(),
          publishStartDate: postDoc.data().publishStartDate?.toDate()
        })
        setAlarmText(`[${postDoc.data().title}] 프로그램이 추가되었습니다.`)
      }
      console.log(postDoc.data())
      setIsLoading(false)
    }
    if(userData)
      fetchData()
    else
      router.push("/")
  },[])

  const onPreviewClick = () => {
    setOpenBackdrop(true)
  }
  const onPreviousClick = () => {setStep(step-1)}
  const onNextClick = () => {setStep(step+1)}

  const handleFormData = (data) => {
    setPostValues({...postValues, ["formData"]: [...data]})
  }


  const onSubmitClick = async () => {
    console.log(postValues.deadline)
    for(const key in postValues){
      if(postValues.hasOwnProperty(key) && (postValues[key]===undefined || postValues[key]===null || postValues[key]==="")){
        if(key==="title"){
          alert(`제목은 빈칸일 수 없습니다.`); return}
        else if(postValues.isMain && key==="mainBg"){
          alert(`배경화면 색상을 선택해주세요.`); return}
        else if(key==="thumbnailBg"){
          alert("썸내일 배경을 선택해주세요."); return}
        else if(postValues.thumbnailBg==="/custom" && key==="customBgURL"){
          alert("썸네일 이미지를 등록해주세요."); return}
        else if(postValues.deadline===undefined){
          alert("신청 마감일을 입력해주세요.");return}
        else if(postValues.deadline < new Date()){
          alert("신청마감일은 현재시각보다 미래의 시간이여야 합니다."); return}
      }
    }
    if(postValues.hasLimit && postValues.limit==="0"){
      alert("인원수 제한은 0명 보다 많아야 합니다.")
      return
    }

    
    const location = sessionStorage.getItem("prevProgramLocId").split("/")
    console.log(sessionStorage.getItem("prevProgramLocId").split("/"))
    
    //query를 위해 sections의 id만 따로 빼줌
    const sectionsId = postValues.sections.map((post)=>post.id)
    //첫 프로그램 등록이라면 location정보 작성위함.
    const doc = await db.collection("team").doc(team_id).collection("programs").doc(file_id).get()
    if(doc.exists){
      db.collection("team").doc(team_id).collection("programs").doc(file_id).update({
        ...postValues,
        sectionsId: sectionsId,
        history: [{type:"submit", date: new Date(), text:`"${userData.displayName}" 님에 의해 저장됨.`},...postValues.history],
        savedAt: new Date(),
        lastSaved: userData.displayName,
      }).then(()=>{
        alert("성공적으로 저장되었습니다!")
      })
    } else{
      db.collection("team").doc(team_id).collection("programs").doc(file_id).set({
        ...postValues,
        sectionsId: sectionsId,
        history: [{type:"create", date: new Date(), text:`"${userData.displayName}" 님에 의해 생성됨.`},...postValues.history],
        savedAt: new Date(),
        lastSaved: userData.displayName,
        location: location[location.length-1]
      }).then(()=>{
        alert("성공적으로 저장되었습니다!")
      })
    }
  }

  const onApplyClick = async () => {
    const doc = await db.collection("team").doc(team_id).collection("programs").doc(file_id).get()
    if(doc.exists){
      db.collection("team").doc(team_id).collection("programs").doc(file_id).update({
        history: [{type:"apply", date: new Date(), text: `"${userData.displayName}" 님에 의해 승인신청.`}, ...postValues.history],
        condition: "waitingForConfirm"
      }).then(()=>{
        alert("성공적으로 승인신청되었습니다.")
      })
    } else{
      alert("저장한 후 승인신청해주세요.")
    }
  }

  const onRejectClick = () => {
    if(rejectText==="" || rejectText===" ")
      alert("거절 사유를 입력해주세요.")
    else{
      db.collection("team").doc(team_id).collection("programs").doc(file_id).update({
        history: [{type:"reject", date: new Date(), text: `"${userData.displayName}" 님에 의해 승인거절됨.`, rejectText: rejectText}, ...postValues.history],
        condition: "decline"
      }).then(()=>{
        alert("승인 거절되었습니다.")
      })
    }
  }

  const onConfirmClick = async() => {
    //예약 게재일이 현재시각보다 미래에 있음(예약게재일 적용) postValues.publishStartDate > new Date()
    if(postValues.publishStartDate > new Date()){
      db.collection("team").doc(team_id).collection("programs").doc(file_id).update({
        condition: "confirm",
        history: [{type: "confirm", date: new Date(), text:`"${userData.displayName}" 님에 의해 승인후 예약게재되었습니다.`}, ...postValues.history]
      }).then(async()=>{
        alert("승인 완료 후 예약게재되었습니다.")

        //메세지 보낼 토큰 불러오기
        if(isSendAlarm){
          alert("알림 전송을 시작합니다. 시간이 소요될 수 있습니다.")
          if(alarmText==="" || alarmText===" "){
            alert("알림문구는 빈칸일 수 없습니다.")
          } else{
            const querySnapshot = await db.collection("user").where("isAlarmOn", "==", true).where("pushToken", ">", "").get()
            const tokenList = querySnapshot.docs.map((doc)=>{
              if(doc.data().alarmSetting && doc.data().alarmSetting[team_id]){
                return doc.data().pushToken
              }else{
                //알람세팅이 되지 않은 초기상태라면 메세지 보내기
                return doc.data().pushToken
              }
            })
            
            //중복된 토큰 삭제
            const uniqueTokenList = [...new Set(tokenList)];
            
            Promise.all(
              uniqueTokenList.map(async (token) => {
                try {
                  const result = await sendNotification(token, alarmText);
                } catch (e) {
                  console.log(e);
                }
              })
            ).then(() => {
              console.log("All notifications sent successfully");
              alert("알림을 성공적으로 전송했습니다.")
            }).catch((error) => {
              console.log("Error sending notifications: ", error);
            });
          }
        } 
      })
    } else{
      db.collection("team").doc(team_id).collection("programs").doc(file_id).update({
        condition: "confirm",
        publishStartDate: new Date(),
        history: [{type: "confirm", date: new Date(), text:`"${userData.displayName}" 님에 의해 승인후 게재되었습니다.`}, ...postValues.history]
      }).then(async()=>{
        
        alert("승인 완료 후 게재되었습니다.")
        
        //메세지 보낼 토큰 불러오기
        if(isSendAlarm){
          alert("알림 전송을 시작합니다. 시간이 소요될 수 있습니다.")
          if(alarmText==="" || alarmText===" "){
            alert("알림문구는 빈칸일 수 없습니다.")
          } else{
            const querySnapshot = await db.collection("user").where("isAlarmOn", "==", true).where("pushToken", ">", "").get()
            const tokenList = querySnapshot.docs.map((doc)=>{
              if(doc.data().alarmSetting && doc.data().alarmSetting[team_id]){
                return doc.data().pushToken
              }else{
                //알람세팅이 되지 않은 초기상태라면 메세지 보내기
                return doc.data().pushToken
              }
            })
            
            //중복된 토큰 삭제
            const uniqueTokenList = [...new Set(tokenList)];
            
            Promise.all(
              uniqueTokenList.map(async (token) => {
                try {
                  const result = await sendNotification(token, alarmText);
                } catch (e) {
                  console.log(e);
                }
              })
            ).then(() => {
              console.log("All notifications sent successfully");
              alert("알림을 성공적으로 전송했습니다.")
            }).catch((error) => {
              console.log("Error sending notifications: ", error);
            });
          }
        }
        
      })
    
    }

  }

  const onCancelClick = () => {
    if(confirm("게재취소하시겠습니까?")){
      db.collection("team").doc(team_id).collection("programs").doc(file_id).update({
        condition: "unconfirm",
        history: [{type:"cancelDeploy", date: new Date(), text:`"${userData.displayName}" 님에 의해 게재 취소되었습니다.`}, ...postValues.history]
      }).then(()=>{
        alert("게재취소되었습니다.")
      })
    }
  }


  if(isLoading)
    return <LoaderGif />

  if(userData?.roles[0]!==`admin_${team_id}`)
  return(<NoAuthority uid={userData?.uid} teamName={team_id} isTeamName={isTeamName}/>)

  return(
    <>
      <div className={styles.main_container}>
        <Header location="editProgram"/>
        <div className={styles.body_container}>
          <Navbar />
          <div className={styles.content_container}>
            <Stepper step={step} handleStep={handleStep} data={data}/>


            <div className={styles.steps_container}>

              {step === 0 && <EditPost values={postValues} setValues={setPostValues} sections={sections} fileId={file_id} teamId={team_id} type="program"/>}
              {step === 1 && <CustomForm formData={postValues.formData} setFormData={handleFormData} teamId={team_id} contentMode={true} id={file_id}/>}
              {step === 2 && 
                <div className={styles.submit_content_container}>
                  <div className={styles.submit_content_item}>
                    <Button variant="contained" size="small" style={{fontSize:"13px"}} sx={{padding: "3px 5px !important"}} onClick={onSubmitClick}>저 장</Button>
                    {/* <p>저장해도 승인신청되지 않습니다.</p> */}
                  </div>
                  <div style={{margin: "25px 0 7px 0", width:"100%", display:"flex", flexWrap:"wrap"}}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileDateTimePicker
                        label="예약게재일을 선택해주세요."
                        value={postValues.publishStartDate}
                        onChange={(e)=>setPostValues({...postValues, ["publishStartDate"]: e})}
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>

                    <div style={{width:"15px"}} />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileDateTimePicker
                        label="신청마감일을 선택해주세요."
                        value={postValues.deadline}
                        onChange={(e)=>setPostValues({...postValues, ["deadline"]: e})}
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>

                    <div style={{width:"15px", marginTop:"15px"}} />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileDateTimePicker
                        label="프로그램 시작일을 선택해주세요."
                        value={postValues.programStartDate}
                        onChange={(e)=>setPostValues({...postValues, ["programStartDate"]: e})}
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                  <p style={{fontSize:"14px", marginBottom:"20px"}}>예약게재일을 현재시각보다 과거의 시간대로 설정하면 예약게재는 자동으로 취소됩니다.</p>


                  <div className={styles.limit_container}>
                    <Switch checked={postValues.hasLimit} onChange={(e)=>{setPostValues({...postValues, hasLimit: e.target.checked})}} size="small" />
                    <p>{postValues.hasLimit ? "인원제한 있음" : "인원제한 없음"}</p>
                    {postValues.hasLimit &&
                      <TextField label="인원수" size="small" value={postValues.limit} onChange={(e)=>{
                        if(!isNaN(e.target.value))
                          setPostValues({...postValues, limit: e.target.value})
                        else
                          alert("입력값은 숫자여야합니다.")}
                      }/>
                    }
                  </div>


                  <div className={styles.submit_content_item}>
                    <Button variant="contained" size="small" style={{fontSize:"13px"}} sx={{padding: "3px 5px !important", backgroundColor:"rgb(239, 123, 60)"}}
                      onClick={onApplyClick} disabled={postValues.condition==="waitingForConfirm" || postValues.condition==="confirm"}
                    >
                      {postValues.condition==="waitingForConfirm" ? "승인대기중" : "승인신청"}
                    </Button>
                    <p>{postValues.condition==="waitingForConfirm" ? "승인대기중입니다. 승인이 완료되면 자동으로 게재됩니다." :
                      postValues.condition==="confirm" ? "승인완료되었습니다." : "승인신청이 완료될때까지 어플에 업로드되지 않습니다."}</p>
                  </div>

                  {(userData.roles[1]==="super" || userData.roles[1]==="high") && postValues.condition==="waitingForConfirm" &&
                    <>
                      <div className={styles.reject_container}>
                        <Button variant="contained" size="small" sx={{backgroundColor:"rgb(176, 36, 36)"}} onClick={onRejectClick}>
                          승인 거절
                        </Button>
                        <TextField sx={{marginLeft:"15px", width:"500px"}} label="거절사유" size="small" multiline value={rejectText} onChange={(e)=>setRejectText(e.target.value)}/>
                      </div>

                      <div className={styles.submit_content_item}>
                      <Button variant="contained" size="small" sx={{backgroundColor:"rgb(45, 45, 179)"}} onClick={onConfirmClick}>
                          승인 및 게재
                        </Button>
                        <h5 style={{fontSize:"14px", marginLeft:"15px"}}>알림 보내기</h5>
                        <Switch checked={isSendAlarm} onChange={(e)=>setIsSendAlarm(e.target.checked)} size="small"/>
                        {isSendAlarm &&
                          <TextField value={alarmText} onChange={(e)=>setAlarmText(e.target.value)} size="small" style={{width:"350px", marginLeft:"10px"}} />
                        }
                      </div>
                    </>
                  }
                  {(userData.roles[1]==="super" || userData.roles[1]==="high") && postValues.condition==="confirm" && 
                    <div className={styles.submit_content_item}>
                      <Button variant="contained" size="small" sx={{backgroundColor:"rgb(176, 36, 36)"}} onClick={onCancelClick}>게재취소</Button>
                    </div>
                  }
                </div>
              }
              
            
              <div className={styles.button_container}>
                {step===0 ? <div className={styles.button}> </div> : <Button onClick={onPreviousClick}>이전</Button>}
                {step===2 ? <div className={styles.button}> </div> : <Button onClick={onPreviewClick}>미리보기</Button>}
                {step===2 ? <div className={styles.button}> </div> : <Button onClick={onNextClick}>다음</Button>}
              </div>
            </div>
          </div>


          <div className={styles.sub_content_container}>
            <SubContent />
          </div>
        </div>
      </div>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={()=>setOpenBackdrop(false)}
      >
         {step === 0  && 
          <div onClick={() => {setTimeout(()=>{setOpenBackdrop(true)},10) }} style={{width:"400px", height:"700px", position:"absolute", backgroundColor:"white", overflow:"scroll", padding: "10px"}}>
            <Article data={postValues} teamName={team_id} id={file_id} type="programs" mode="preview" />
          </div>
        }
        {step === 1 && 
          <div style={{width:"400px", height:"700px", backgroundColor:"white", overflow:"scroll", padding: "10px"}}>
            <Form formDatas={postValues.formData} data={[]} handleData={()=>{}} addMargin={true} />
          </div>
        }
      </Backdrop>
    </>
  )
}

export default EditProgram