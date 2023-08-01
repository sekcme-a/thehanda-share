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
import Editor from 'src/public/components/Editor';
import SelectMultipleChip from "src/mui/SelectMultipleChip"

import { Backdrop } from "@mui/material"
import Form from "src/form/Form"
import ShowArticle from "src/public/components/ShowArticle"
import SubContent from "src/public/subcontent/components/SubContent"
//stepper
const data = [
  "게시물 작성",
  "저장 및 게재",
]

const EditAnouncement = () => {
  const router = useRouter()
  const {team_id, file_id} = router.query
  const {userData, setTeamId, teamId} = useData()
  const [sectionItems, setSectionItems] = useState([])
  const [selectedSections, setSelectedSections] = useState([])
  const [step, setStep] = useState(0)
  const [openBackdrop, setOpenBackdrop] = useState(false)

  const handleStep = (num) => {setStep(num)}

  const [postValues, setPostValues] = useState({
    isMain: false,
    condition: "unconfirm",
    history: [],
    author: userData.uid,
    team: [userData.uid],
    sections: [],
    title: "",
    subtitle: "",
    textData: ""
  })
  const [sections, setSections] = useState([])
  const [rejectText, setRejectText] = useState("")

  const [isLoading, setIsLoading] = useState(true)

  // const onValuesChangeWithEvent = (event, type) => {
  //   setPostValues({...postValues, ["type"]: event.target.value})
  // }
  const onPostValuesChange = (prop) => (event) => {
    setPostValues({...postValues, [prop]: event.target.value})
  }
  const onTextDataChange = (html) => {
    setPostValues({...postValues, textData: html})
  }

  const onValuesChange = (key, value) => {
    setPostValues({...postValues, [key]: value})
  }

  useEffect(()=>{
    console.log(selectedSections)
    const selected = sections.map(item => {
      for (const selectedSection of selectedSections) {
        if (selectedSection === item.name) {
          return {name: item.name, id: item.id}
        }
      }
    }).filter(Boolean);
    onValuesChange("sections", selected)
  },[selectedSections])

  useEffect(()=>{
    const fetchData = async () => {
      setTeamId(team_id)
      const sectionDoc = await db.collection("team").doc(team_id).collection("section").doc("anouncement").get()
      if(sectionDoc.exists && sectionDoc.data().data.length>0)
        setSections(sectionDoc.data().data)
      else{
        alert("아직 섹션이 없습니다. 프로그램 섹션을 1개 이상 추가한 후 다시 시도해주세요.")
        router.push(`/${team_id}/section/anouncement`)
      }
      
      const postDoc = await db.collection("team").doc(team_id).collection("anouncements").doc(file_id).get()
      if(postDoc.exists){
        setPostValues({...postDoc.data()
        })
          
      const selectedSectionNameArray = postDoc.data().sections.map(section => section.name)
      setSelectedSections(selectedSectionNameArray)
      }
      console.log(postDoc.data())
      const sectionsNameArray = sectionDoc.data()?.data.map(section => section.name);
      setSectionItems(sectionsNameArray)

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

    
    let location = sessionStorage.getItem("prevAnouncementLocId")?.split("/")
    //현재 위치가 루트폴더가 아니라면 폴더들을 탐색해 현재 위치가 존재하는지 확인해야함
    if(location?.length>1){
    //해당 프로그램을 저장하려는 location경로가 없는 경로라면(해당 프로그램을 편집할때 다른 유저가 해당 폴더를 삭제한 경우 보완) 루트위치에 저장.
      const folderLocationDoc = await db.collection("team_admin").doc(team_id).collection("folders").doc(location[location.length-1]).get()
      if(!folderLocationDoc.exists){
        location = ["anouncement"]
        sessionStorage.setItem("prevAnouncementLoc", "ANOUNCEMENT")
        sessionStorage.setItem("prevAnouncementLocId", "anouncement")
        
        if(!confirm("현재의 폴더 경로가 삭제되었습니다.\n(공지사항 편집중에 다른 유저가 해당 위치의 폴더를 삭제했을 가능성이 높습니다.)\n해당 공지사항을 최상단 경로에 저장하시겠습니까?"))
          return;
      }
    }
    
    //query를 위해 sections의 id만 따로 빼줌
    const sectionsId = postValues.sections.map((post)=>post.id)
    //첫 프로그램 등록이라면 location정보 작성위함.
    const doc = await db.collection("team").doc(team_id).collection("anouncements").doc(file_id).get()
    if(doc.exists){
      db.collection("team").doc(team_id).collection("anouncements").doc(file_id).update({
        ...postValues,
        sectionsId: sectionsId,
        history: [{type:"submit", date: new Date(), text:`"${userData.displayName}" 님에 의해 저장됨.`},...postValues.history],
        savedAt: new Date(),
        lastSaved: userData.displayName,
      }).then(()=>{
        alert("성공적으로 저장되었습니다!")
      })
    } else{
      db.collection("team").doc(team_id).collection("anouncements").doc(file_id).set({
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
    const doc = await db.collection("team").doc(team_id).collection("anouncements").doc(file_id).get()
    if(doc.exists){
      db.collection("team").doc(team_id).collection("anouncements").doc(file_id).update({
        history: [{type:"apply", date: new Date(), text: `"${userData.displayName}" 님에 의해 승인신청.`}, ...postValues.history],
        condition: "waitingForConfirm"
      }).then(()=>{
        alert("성공적으로 승인신청되었습니다.")
        router.reload()
      })
    } else{
      alert("저장한 후 승인신청해주세요.")
    }
  }

  const onRejectClick = () => {
    if(rejectText==="" || rejectText===" ")
      alert("거절 사유를 입력해주세요.")
    else{
      db.collection("team").doc(team_id).collection("anouncements").doc(file_id).update({
        history: [{type:"reject", date: new Date(), text: `"${userData.displayName}" 님에 의해 승인거절됨.`, rejectText: rejectText}, ...postValues.history],
        condition: "decline"
      }).then(()=>{
        alert("승인 거절되었습니다.")
      })
    }
  }

  const onConfirmClick = () => {
    //예약 게재일이 현재시각보다 미래에 있음(예약게재일 적용) postValues.publishStartDate > new Date()
    if(postValues.publishStartDate > new Date()){
      db.collection("team").doc(team_id).collection("anouncements").doc(file_id).update({
        condition: "confirm",
        history: [{type: "confirm", date: new Date(), text:`"${userData.displayName}" 님에 의해 승인후 예약게재되었습니다.`}, ...postValues.history]
      }).then(()=>{
        alert("승인 완료 후 예약게재되었습니다.")
      })
    } else{
      db.collection("team").doc(team_id).collection("anouncements").doc(file_id).update({
        condition: "confirm",
        publishStartDate: new Date(),
        history: [{type: "confirm", date: new Date(), text:`"${userData.displayName}" 님에 의해 승인후 게재되었습니다.`}, ...postValues.history]
      }).then(()=>{
        alert("승인 완료 후 게재되었습니다.")
      })
    }
    // db.collection("team").doc(team_id).collection("anouncements").doc(file_id).update({
    //   condition: "confirm",
    //   publishStartDate: new Date(),
    // })
  }

  const onCancelClick = () => {
    if(confirm("게재취소하시겠습니까?")){
      db.collection("team").doc(team_id).collection("anouncements").doc(file_id).update({
        condition: "unconfirm",
        history: [{type:"cancelDeploy", date: new Date(), text:`"${userData.displayName}" 님에 의해 게재 취소되었습니다.`}, ...postValues.history]
      }).then(()=>{
        alert("게재취소되었습니다.")
      })
    }
  }

  const createMarkup = () => {
    return {__html: postValues.textData}
  }


  if(isLoading)
    return <LoaderGif />

  if(userData?.roles[0]!==`admin_${team_id}`)
  return(<NoAuthority uid={userData?.uid} teamName={team_id} isTeamName={isTeamName}/>)

  return(
    <>
      <div className={styles.main_container}>
        <Header location="editAnouncement"/>
        <div className={styles.body_container}>
          <Navbar />
          <div className={styles.content_container}>
            <Stepper step={step} handleStep={handleStep} data={data}/>


            <div className={styles.steps_container}>

              {step === 0 && 
                <div>
                  <div className={styles.item_container}>
                    <TextField id="standard-basic" label="제목" variant="standard" value={postValues.title} onChange={onPostValuesChange("title")} type="anouncement"/>
                  </div>
                  <div className={styles.item_container}>
                    <TextField id="standard-basic" label="부제목" variant="standard" value={postValues.subtitle} onChange={onPostValuesChange("subtitle")} />
                  </div>
                  <div className={styles.item_container} style={{marginTop:"15px"}}>
                  <h1>섹션</h1>
                    <div className={styles.checkbox}>
                      <SelectMultipleChip title="섹션선택" items={sectionItems} selectedItems={selectedSections} setSelectedItems={setSelectedSections}/>
                      {/* <MuiSelectChip title="프로그램 섹션" items={sections} onValuesChange={onValuesChange}/> */}
                    </div>
                  </div>
                  <div className={styles.border} />
                  
                  <div style={{width: "100%", marginTop: "15px"}}>
                  <Editor path={`content/${file_id}`} handleChange={onTextDataChange} textData={postValues.textData} />
                  </div>
                </div>
                              }
              {step === 1 && 
                <div className={styles.submit_content_container}>
                  <div className={styles.submit_content_item}>
                    <Button variant="contained" size="small" style={{fontSize:"13px"}} sx={{padding: "3px 5px !important"}} onClick={onSubmitClick}>저 장</Button>
                    {/* <p>저장해도 승인신청되지 않습니다.</p> */}
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
            {/* <SubContent /> */}
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
            {/* <ShowArticle data={postValues} teamName={team_id} id={file_id} type="anouncement" mode="preview" /> */}
            <ShowArticle createMarkup={createMarkup} data={postValues} teamName={team_id} id={"id"} type="anouncement" />
          </div>
        }
      </Backdrop>
    </>
  )
}

export default EditAnouncement