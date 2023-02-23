import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firestore as db } from 'firebase/firebase';

//values.content 랑 surveyStartDate undefined되있음.

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDatePicker } from '@mui/x-date-pickers'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
// import { TimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers';
import Backdrop from '@mui/material/Backdrop';
import DeleteIcon from '@mui/icons-material/Delete';



import DropperImage from "./DropperImage"
// import DateTime from 'src/form/items/DateTime';
import ShowArticle from 'src/public/components/ShowArticle';
import styles from "../styles/stepper.module.css"
import Form from "src/form/Form.js"
import Select from "./Select"
import SwiperContainer from "./SwiperContainer"
import Article from "./Article"

import { firebaseHooks } from 'firebase/hooks';
import useData from 'context/data';


// ** Next Import
import dynamic from 'next/dynamic'


import CustomForm from 'src/[team_id]/userProfileSettings/components/CustomForm';


// ! To avoid 'Window is not defined' error
// const ReactDraftWysiwyg = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {
//   ssr: false
// })

// const QuillNoSSRWrapper = dynamic(import('react-quill'), {
//   ssr: false,
//   loading: () => <p>로딩중 ...</p>,
// })

// const Editor = dynamic(import('src/components/public/Editor'), {
//   ssr: false,
//   loading: () => <p>로딩중 ...</p>,
// })
import Editor from 'src/public/components/Editor';

const backgroundItems = [
  {value:"/background/black.jpg", text:"검은색"},
  {value:"/background/blue.jpg", text:"파란색"},
  {value:"/background/darkblue.jpg", text:"짙은파란색"},
  {value:"/background/green.jpg", text:"초록색"},
  {value:"/background/orange.jpg", text:"주황색"},
  {value:"/background/purple.jpg", text:"보라색"},
  {value:"/background/red.jpg", text:"빨간색"},
  {value:"/background/.jpg", text:"노란색"},
]
const thumbnailBgItems = [
  { value: "/custom", text: "[직접제작]" },
  { value: "/thumbnail/001.png", text: "파란피카소" },
  { value: "/thumbnail/002.png", text: "한국전통배경1" },
  { value: "/thumbnail/003.png", text: "한국전통배경2" },
  { value: "/thumbnail/004.png", text: "복주머니" },
  { value: "/thumbnail/005.png", text: "야자수" },
  { value: "/thumbnail/006.png", text: "화난선생" },
  { value: "/thumbnail/007.png", text: "겨울선물" },
  { value: "/thumbnail/008.png", text: "바닷모래" },
  { value: "/thumbnail/009.png", text: "엄지척남자" },
  { value: "/thumbnail/010.png", text: "꽃다발" },
  { value: "/thumbnail/011.png", text: "집" },
  { value: "/thumbnail/012.png", text: "가을남자" },
  { value: "/thumbnail/013.png", text: "보름달뜬밤" },
  
]
export default function HorizontalLinearStepper({ id, teamName, type }) {
  const [steps, setSteps] = useState([])
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [textData, setTextData] = useState()
  const [hasSurvey, setHasSurvey] = useState(false)
  const [surveyId, setSurveyId] = useState("")
  const [deadline, setDeadline] = useState()
  const [programStartDate, setProgramStartDate] = useState()
  const [publishStartDate, setPublishStartDate] = useState(new Date())
  const [surveyStartDate, setSurveyStartDate] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [informationList, setInformationList] = useState([])
  const [hasSaved, setHasSaved] = useState(false)
  const [hasLimit, setHasLimit] = useState(false)
  const [limit, setLimit] = useState("")
  const handleCloseBackDrop = () => {setOpenBackdrop(false)}
  const onTextChange = (html) => {
    setTextData(html)
    console.log(`html: ${html}`)
  }
  const onHtmlChange = (html, index) => {
    onContentChange(index, "html", html)
  }
  const [values, setValues] = useState({
    main: false,
    title: "",
    subtitle: "",
    date: "",
    mainThumbnailImg:"",
    thumbnailImg: "",
    backgroundColor: "/background/black.jpg",
    thumbnailBackground: "/thumbnail/001.png",
    informationText: "",
    content: [],
    schedule:[],
    keyword:""
  })
  const onValuesChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const [alarmValues, setAlarmValues] = useState({
    marriage: false,
    spouse: false,
    children: false,
    family: false,
    all: false,
  })
  const onAlarmValuesChange = (prop) => (event) => {
    if (prop === "all")
      if(event.target.checked)
        setAlarmValues({marriage: true,spouse: true,children: true,family: true,all: true,})
      else
        setAlarmValues({marriage: false,spouse: false,children: false,family: false,all: false,})
    else
      setAlarmValues({...alarmValues, [prop]: event.target.checked})
  }

  const { user, teamId } = useData()
  const [mainFormData, setMainFormData] = useState([])
  const [surveyFormData, setSurveyFormData] = useState([])
  const router = useRouter()


  useEffect(() => {
    if(type==="programs")
      setSteps(['게시물 작성', '폼 작성', '저장 및 게재'])
    else if(type==="surveys")
      setSteps(['게시물 작성', '폼 작성', '저장 및 게재'])
    else
      setSteps(['게시물 작성', '저장 및 게재'])
    if( type==="anouncements"){
      db.collection(type).doc(id).get().then((doc) => {
        setValues({
          title: doc.data().title,
          subtitle: doc.data().subtitle,
        })
        setTextData(doc.data().html)
        setIsPublished(doc.data().published)
      })
    }
    else{
    db.collection(type).doc(id).get().then((doc) => {
      if (doc.exists) {
        setValues({
          title: doc.data().title,
          subtitle: doc.data().subtitle,
          keyword: doc.data().keyword,
          thumbnailImg: doc.data().thumbnailImg,
          main: doc.data().main,
          date: doc.data().date,
          mainThumbnailImg:doc.data().mainThumbnailImg,
          backgroundColor: doc.data().backgroundColor,
          thumbnailBackground: doc.data().thumbnailBackground,
          informationText: doc.data().informationText,
          content: doc.data().content,
          schedule: doc.data().schedule,
        })
        setHasLimit(doc.data().hasLimit)
        setLimit(doc.data().limitCount)
        setTextData(doc.data().content)
        setMainFormData([...doc.data().form])
        setHasSurvey(doc.data().hasSurvey)
        setSurveyId(doc.data().surveyId)
        setIsPublished(doc.data().published)
        setDeadline(doc.data().deadline?.toDate())
        setProgramStartDate(doc.data().programStartDate?.toDate())
        setSurveyStartDate(doc.data().surveyStartDate ? doc.data().surveyStartDate?.toDate() : "")
        setPublishStartDate(doc.data().publishedDate ? doc.data().publishedDate?.toDate(): new Date())
        if(doc.data().alarm)
          setAlarmValues(doc.data().alarm)
        if (doc.data().hasSurvey === true && doc.data().surveyId) {
          db.collection("contents").doc(teamId).collection("programSurveys").doc(doc.data().surveyId).get().then((doc) => {
            setSurveyFormData(doc.data().form)
          })
        }
      }
    })
    }
  },[])


  const isStepOptional = (step) => {
    // return step === 1;
    return false;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (type === "programs" && (activeStep === 0 || activeStep === 1)) {

      if (values.main) {
        if (values.title === "") {
          alert("제목을 입력해주세요.")
          return
        }
        if (values.thumbnailBackground === "/custom" && values.mainThumbnailImg === "") {
          alert("썸네일을 업로드해주세요.")
          return
        }
      }
    }
    if (type === "programs" && activeStep === 1) {
        if (values.title === "") {
          alert("제목을 입력해주세요.")
          return
        }
        if (values.subtitle === "") {
          alert("부제목을 입력해주세요.")
          return
        }
    }
    if (type === "programs" && activeStep === 3) {
      if (hasSurvey && surveyStartDate === "") {
        alert("설문조사 시작일을 입력해주세요.")
        return
      }
    }
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = (step) => {
    if(step===0)
      router.back()
    else
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const setImgURL = (url) => {
    setValues({...values, thumbnailImg: url})
  }
  const setMainThumbnailURL = (url) => {
    setValues({...values, mainThumbnailImg: url})
  }

  useEffect(() => {
      let information = []
      if (values.informationText !== "" && values.informationText!==undefined) {
        const tempList = values.informationText.split("[[")
        for (let i = 1; i < tempList.length; i++) {
          const item = tempList[i].split("]]")
          if (item !== undefined && item[0]!==undefined && item[1]!==undefined) {
            if (item[1].includes("<<")) {
              let temp = item[1].split("<<")
              information.push({ title: item[0], text: temp[0] })
              let temp2 = temp[1].split(">>")
              information.push({ type: "button", title: temp2[0], text: temp2[1] })
            } else {
              information.push({ title: item[0], text: item[1] })
            }
          }
        }
    }
    setInformationList([...information])
  },[values.informationText])

  const onSaveClick = async(openAlert) => {
    if(hasLimit && isNaN(limit)){
      alert("선착순 인원은 숫자만 입력가능합니다.")
      return
    }
    try {
      if(type==="anouncements"){
        await db.collection("team_admin").doc(teamId).collection("anouncements").doc(id).set({
          lastSaved: user.uid,
          savedDate: new Date()
        })
        await db.collection("anouncements").doc(id).set({
          title: values.title,
          subtitle: values.subtitle,
          html: textData,
        })
        setHasSaved(true)
        alert("저장되었습니다.")
        return
      }


      console.log(sessionStorage.getItem("prevSurveyFolderLocation"))
      let location = ""
      if(type==="programs")
        location = sessionStorage.getItem("prevFolderLocation")
      else
        location = sessionStorage.getItem("prevSurveyFolderLocation")
      console.log(location)

      await firebaseHooks.save_content(teamId, type, id,
        {
          main: values.main,
          title: values.title,
          subtitle: values.subtitle,
          date: values.date,
          mainThumbnailImg: values.mainThumbnailImg,
          thumbnailImg: values.thumbnailImg,
          backgroundColor: values.backgroundColor,
          thumbnailBackground: values.thumbnailBackground==="/custom" ? values.mainThumbnailImg : values.thumbnailBackground,
          informationText: values.informationText,
          information: informationList, 
          content: values.content,
          schedule: values.schedule,
          // content: textData,
          form: mainFormData,
          savedDate: new Date(),
          lastSaved: user.uid,
          // hasSurvey: hasSurvey,
          // surveyId: sid,
          alarm: alarmValues,
          // surveyStartDate: surveyStartDate,
          hasLimit: hasLimit,
          limitCount: limit,
          keyword: values.keyword,
          location: location
        })
      if(openAlert!==false){
        alert("성공적으로 저장되었습니다.")
        setHasSaved(true)
      }
    } catch (e) {
      
    }
  }

  const onPublishClick = async () => {
    onSaveClick(false)
    // setIsPublished(!isPublished)
    if(type==="anouncements"){
      setIsPublished(!isPublished)
      if(!isPublished){
        await db.collection("team_admin").doc(teamId).collection(type).doc(id).update({
          published: true,
          publishedDate: new Date(),
        })
        await db.collection("team").doc(teamId).collection(type).doc(id).set({
          publishedDate: new Date()
        })
        alert("게재되었습니다.")
      } else{
        await db.collection("team_admin").doc(teamId).collection(type).doc(id).update({
          published: false,
        })
        await db.collection("team").doc(teamId).collection(type).doc(id).delete()
        alert("게재취소되었습니다.")
      } 
      await db.collection(type).doc(id).update({
        published: !isPublished
      })
      return
    }
    if(deadline===undefined){
      alert("마감일을 선택해주세요.")
    }
    else if(type==="programs" && programStartDate===undefined){
      alert("프로그램 시작일을 선택해주세요.")
    }
    else{
      let input = true
      //게재취소시엔 사용자 폼 데이터 삭제
      if(!isPublished===false)
        input = confirm("게재취소시 기존의 사용자 폼 입력 데이터는 사라집니다.\n게재취소하시겠습니까?")
      if(input){
        //메인 프로그램이라면, 이전 메인 프로그램 확인 후 변경
        setIsPublished(!isPublished)
        // if (values.main && !isPublished) {
        //   db.collection("contents").doc("main").collection("list").doc(teamId).get().then((doc) => {
        //     if (doc.exists) {
        //       const prevId = doc.data().id
        //       //메인 프로그램이 변경됬다면 기존 메인프로그램의 doc.data().main을 false로 변경
        //       if (id !== prevId) {
        //         db.collection("contents").doc(teamId).collection("programs").doc(prevId).update({ main: false })
        //       }
        //     }
        //     db.collection("contents").doc("main").collection("list").doc(teamId).set({
        //       id: id,
        //       title: values.title,
        //       date: values.date,
        //       mainThumbnailImg: values.mainThumbnailImg,
        //       backgroundColor: values.backgroundColor,
        //       thumbnailBackground: values.thumbnailBackground==="/custom" ? values.mainThumbnailImg : values.thumbnailBackground,
        //     })
        //   })
        // }
        // if(type!=="anouncements")
        //   await firebaseHooks.save_content(teamId, type, id, { deadline: deadline })
        if(publishStartDate < new Date()){
          if (type==="programs")
            await firebaseHooks.publish_content(teamId, type, id,user.uid,  !isPublished, new Date(), {deadline: deadline, programStartDate: programStartDate})
          else
            await firebaseHooks.publish_content(teamId, type, id,user.uid,  !isPublished, new Date(), {deadline: deadline})
        }
        else {
          if(type==="programs")
            await firebaseHooks.publish_content(teamId, type, id,user.uid,  !isPublished, publishStartDate, {deadline: deadline, programStartDate: programStartDate})
          else 
            await firebaseHooks.publish_content(teamId, type, id,user.uid,  !isPublished, publishStartDate, {deadline: deadline})
        }
        if(!isPublished)
          alert("게재되었습니다.")
        else
          alert("게재취소되었습니다.")
      }
  }
  }

  const onPreviewClick = () => {
    setOpenBackdrop(true)
  }
  const createMarkup = () => {
    return {__html: textData}
  }

  const onAddContentClick = () => {
    setValues({...values, content: [...values.content, {title: "", html:""}]})
  }

  const onContentChange = (index, type, value) => {

    const changedValue = values.content.map((item, i) => i === index ? { ...item, [type]: value } : item)
    
    if (type === "title") {
      if (changedValue[0].title!==values.content[index].title) {
        setValues({ ...values, content: [...changedValue] })
      }
    }
    else if (type === "html")
      console.log([...changedValue])
      if (changedValue[0].html !== values.content[index].html)
        setValues({ ...values, content: [...changedValue] })
  }

  const onDeleteContentClick = (index) => {
    values.content.splice(index, 1)
    setValues({ ...values, content: values.content })
  }

  const onAddScheduleClick = () => {
    setValues({...values, schedule: [...values.schedule, {title: "", date:"", text:""}]})
  }

  const onScheduleChange = (index, type, value) => {

    const changedValue = values.schedule.map((item, i) => i=== index ? { ...item, [type]: value} : item)
    setValues({ ...values, schedule: changedValue })
  }

  const onDeleteScheduleClick = (index) => {
    values.schedule.splice(index, 1)
    setValues({ ...values, schedule: values.schedule })
  }



  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={index} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
          <React.Fragment>
            <Card sx={{ padding: "10px 25px", mt: "20px" }}>
              {/* {activeStep === 0 && type==="programs" && 
                <>
                  <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}. 메인프로그램 설정</Typography>

                  <div className={styles.main_container}>
                    <div className={styles.item_container}>
                      <FormControlLabel
                        control={
                          <Switch checked={values.main} onChange={(e) => setValues({ ...values, ["main"]: e.target.checked })} />
                        }
                        label="메인 프로그램 여부 (메인 프로그램은 한개만 설정 가능하며, 메인 프로그램으로 게제 시 이전 메인 프로그램은 자동으로 해제됩니다.)"
                      />
                    </div>
                  {values.main && 
                    <>
                      <div className={styles.item_container}>
                        <TextField id="standard-basic" label="제목" variant="standard" value={values.title} onChange={onValuesChange("title")} />
                      </div>
                      <div className={styles.item_container} style={{marginTop:"10px"}}>
                        <TextField id="standard-basic" multiline label="기간 문구" variant="standard" value={values.date} onChange={onValuesChange("date")} />
                      </div>
                      <div className={styles.item_container} style={{marginTop:'20px'}}>
                        <Select
                          title="배경 색상"
                          items={backgroundItems}
                          style={{width:"200px"}}
                          value={values.backgroundColor}
                          handleChange={onValuesChange("backgroundColor")}
                        />
                      </div>
                      <div className={styles.item_container} style={{marginTop:'20px'}}>
                        <Select
                          title="썸네일 배경"
                          items={thumbnailBgItems}
                          style={{width:"200px"}}
                          value={values.thumbnailBackground}
                          handleChange={onValuesChange("thumbnailBackground")}
                          helperText={values.thumbnailBackground==="/custom" && "어플 UI를 위해 썸네일을 최대한 1080px * 720px 사이즈에 맞춰서 제작부탁드립니다."}
                        />
                      </div>
                      <div className={styles.items_container}>
                        {type !== "anouncements" && values.thumbnailBackground === "/custom" &&
                          <DropperImage setImgURL={setMainThumbnailURL} path={`content/${id}/mainThumbnailImg`} imgURL={values.mainThumbnailImg} />
                        }

                      </div>
                    </>
                  }
                  </div>
                </>
              } */}
              {activeStep === 0 && type==="anouncements" && 
                <>
                  <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}. 게시물 작성</Typography>

                  <div className={styles.main_container}>
                    <div className={styles.item_container}>
                      <TextField id="standard-basic" label="제목" variant="standard" value={values.title} onChange={onValuesChange("title")} />
                    </div>
                    <div className={styles.item_container}>
                      <TextField id="standard-basic" label="부제목" variant="standard" value={values.subtitle} onChange={onValuesChange("subtitle")} />
                    </div>
                    <div className={styles.items_container}>
                    {type !== "anouncements" && <DropperImage setImgURL={setImgURL} path={`content/${id}/thumbnailImg`} imgURL={values.thumbnailImg} />}
                    </div>
                    <div style={{width: "100%", marginTop: "15px"}}>
                    <Editor path={`content/${id}`} handleChange={onTextChange} textData={textData} />
                    </div>
                  </div>
                </>
              }
              {(activeStep === 0 && type==="programs") && 
                <>
                  <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}. 게시물 작성</Typography>

                  <div className={styles.main_container}>
                    <div className={styles.item_container}>
                      <TextField id="standard-basic" label="제목" variant="standard" value={values.title} onChange={onValuesChange("title")} />
                    </div>
                    <div className={styles.item_container}>
                      <TextField id="standard-basic" label="부제목" variant="standard" value={values.subtitle} onChange={onValuesChange("subtitle")} />
                    </div>
                    <div className={styles.item_container}>
                      <TextField id="standard-basic" label="키워드" variant="standard" value={values.keyword} onChange={onValuesChange("keyword")} />
                    </div>
                    <div className={styles.item_container} style={{marginTop:"10px"}}>
                      <TextField id="standard-basic" multiline label="기간 문구" variant="standard" value={values.date} onChange={onValuesChange("date")} />
                    </div>
                    <div className={styles.item_container} style={{marginTop:'20px'}}>
                      <Select
                        title="썸네일 배경"
                        items={thumbnailBgItems}
                        style={{width:"200px"}}
                        value={values.thumbnailBackground}
                        handleChange={onValuesChange("thumbnailBackground")}
                        helperText={values.thumbnailBackground==="/custom" && "어플 UI를 위해 썸네일을 최대한 1080px * 720px 사이즈에 맞춰서 제작부탁드립니다."}
                      />
                    </div>
                    <div className={styles.items_container} style={{width:"100%"}}>
                      {type !== "anouncements" && values.thumbnailBackground === "/custom" &&
                        <DropperImage setImgURL={setMainThumbnailURL} path={`content/${id}/mainThumbnailImg`} imgURL={values.mainThumbnailImg} />
                      }

                    </div>
                    <TextField
                      id="standard-multiline-static"
                      label="정보창 작성"
                      multiline
                      minRows={4}
                      value={values.informationText}
                      onChange={onValuesChange("informationText")}
                      placeholder={"[[접수기간]]2000.01.01~2000.01.02\n<<공식 홈페이지>>https://www.naver.com"}
                      variant="standard"
                      style={{marginTop:"10px", width:"700px"}}
                    />
                  

                  <p style={{ width: "100%", marginTop: "80px", marginBottom: "15px", fontSize:"20px", fontWeight:"bold" }}>프로그램 소개</p>
                  
                  {/* <Editor path={`content/${id}`} handleChange={onTextChange} textData={textData} /> */}
                  {values.content.map((item, index) => {
                      return (
                        <div key={index} style={{marginBottom:"50px", width:"100%"}}>
                          <div className={styles.item_container} style={{width:"70%"}}>
                            <TextField id="index" style={{ marginBottom: "20px" }} label="제목" variant="standard" value={item.title} onChange={(e)=>onContentChange(index, "title", e.target.value)} />
                            <DeleteIcon style={{ padding: "22px 0 0 30px", color: "#555", fontSize: "19px", cursor: "pointer" }}
                              onClick={() => onDeleteContentClick(index)} />
                            <Editor path={`content/${id}`} handleChange={onHtmlChange} textData={item.html} index={index} /> 
                          </div>
                        </div>
                      )
                  })}
                  <Button variant="outlined" style={{fontSize:"13px",padding:"3px 9px"}} onClick={onAddContentClick}>내용 추가 +</Button>

                  <p style={{ width: "100%", marginTop: "80px", marginBottom: "15px", fontSize:"20px", fontWeight:"bold" }}>프로그램 일정</p>

                  {values.schedule.map((item, index) => {
                      return (
                        <div key={index} style={{marginBottom:"30px", width:"100%"}}>
                          <div className={styles.item_container}>
                            <TextField id="index" style={{ marginBottom: "20px" }} label="날짜" variant="standard" value={item.date} onChange={(e)=>onScheduleChange(index, "date", e.target.value)} />
                              <DeleteIcon style={{ padding: "22px 0 0 30px", color: "#555", fontSize: "19px", cursor: "pointer" }}
                              onClick={() => onDeleteScheduleClick(index)} />
                            <div style={{width:"100%", display: "flex"}}>
                              <TextField id="index" style={{ marginBottom: "20px", width:"200px" , marginRight:"20px"}} label="제목" variant="standard" value={item.title} onChange={(e)=>onScheduleChange(index, "title", e.target.value)} />
  
                            <TextField id="index" style={{ marginBottom: "20px", width:"500px" }} multiline label="내용" variant="standard" value={item.text} onChange={(e)=>onScheduleChange(index, "text", e.target.value)} />
                            </div>
                          </div>
                        </div>
                      )
                  })}
                  <Button variant="outlined" style={{fontSize:"13px",padding:"3px 9px"}} onClick={onAddScheduleClick}>내용 추가 +</Button>
             
                  



                </div>
                
                </>
              }
              {(activeStep === 0 && type==="surveys") && 
                <>
                  <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}. 게시물 작성</Typography>

                  <div className={styles.main_container}>
                    <div className={styles.item_container}>
                      <TextField id="standard-basic" label="제목" variant="standard" value={values.title} onChange={onValuesChange("title")} />
                    </div>
                    <div className={styles.item_container}>
                      <TextField id="standard-basic" label="부제목" variant="standard" value={values.subtitle} onChange={onValuesChange("subtitle")} />
                    </div>
                    <div className={styles.item_container} style={{marginTop:"10px"}}>
                      <TextField id="standard-basic" multiline label="기간 문구" variant="standard" value={values.date} onChange={onValuesChange("date")} />
                    </div>
                    <div className={styles.item_container} style={{marginTop:'20px'}}>
                      <Select
                        title="썸네일 배경"
                        items={thumbnailBgItems}
                        style={{width:"200px"}}
                        value={values.thumbnailBackground}
                        handleChange={onValuesChange("thumbnailBackground")}
                        helperText={values.thumbnailBackground==="/custom" && "어플 UI를 위해 썸네일을 최대한 1080px * 720px 사이즈에 맞춰서 제작부탁드립니다."}
                      />
                    </div>
                    <div className={styles.items_container} style={{width:"100%"}}>
                      {type !== "anouncements" && values.thumbnailBackground === "/custom" &&
                        <DropperImage setImgURL={setMainThumbnailURL} path={`content/${id}/mainThumbnailImg`} imgURL={values.mainThumbnailImg} />
                      }

                    </div>
                    <TextField
                      id="standard-multiline-static"
                      label="정보창 작성"
                      multiline
                      minRows={4}
                      value={values.informationText}
                      onChange={onValuesChange("informationText")}
                      placeholder={"[[접수기간]]2000.01.01~2000.01.02\n<<공식 홈페이지>>https://www.naver.com"}
                      variant="standard"
                      style={{marginTop:"10px", width:"700px"}}
                    />
                  

                  <p style={{ width: "100%", marginTop: "80px", marginBottom: "15px", fontSize:"20px", fontWeight:"bold" }}>설문조사 정보</p>
                  
                  {/* <Editor path={`content/${id}`} handleChange={onTextChange} textData={textData} /> */}
                  {values.content.map((item, index) => {
                      return (
                        <div key={index} style={{marginBottom:"50px", width:"100%"}}>
                          <div className={styles.item_container} style={{width:"70%"}}>
                            <TextField id="index" style={{ marginBottom: "20px" }} label="제목" variant="standard" value={item.title} onChange={(e)=>onContentChange(index, "title", e.target.value)} />
                            <DeleteIcon style={{ padding: "22px 0 0 30px", color: "#555", fontSize: "19px", cursor: "pointer" }}
                              onClick={() => onDeleteContentClick(index)} />
                            <Editor path={`content/${id}`} handleChange={onHtmlChange} textData={item.html} index={index} /> 
                          </div>
                        </div>
                      )
                  })}
                  <Button variant="outlined" style={{fontSize:"13px",padding:"3px 9px"}} onClick={onAddContentClick}>내용 추가 +</Button>
                

                </div>
                
                </>
              }
              {activeStep === 1 && type==="programs" &&
                <>
                  <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}. 폼 작성</Typography>

                  <div className={styles.main_container}>
                  <CustomForm formData={mainFormData} setFormData={setMainFormData} teamId={teamId} contentMode={true} id={id} />
                  </div>
                </>
              }
              {activeStep === 1 && type==="surveys" &&
                <>
                  <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}. 폼 작성</Typography>

                  <div className={styles.main_container}>
                  <CustomForm formData={mainFormData} setFormData={setMainFormData} teamId={teamId} contentMode={true} id={id} />
                  </div>
                </>
              }
              {activeStep === 1 && type==="anouncements" &&
                <>
                  <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}. 저장 및 게재</Typography>

                  <div className={styles.main_container}>
                    <div className={styles.container}>
                      <p>저장해도 게재 전까지는 사용자들에게 보여지지 않습니다.</p>
                      <Button variant="text" disabled={isPublished} onClick={onSaveClick} style={{ fontSize: "16px" }}>저장</Button>
                    </div>

                    <div className={styles.container}>
                    <p>게재 후엔 내용 변경이 불가능합니다.</p>
                    {isPublished && <Button disabled={true} style={{ fontSize: "16px" }}>게재됨</Button>}
                    <Button variant="text" disabled={!hasSaved && !isPublished} onClick={onPublishClick} style={{ fontSize: "16px" }}
                    >{isPublished ? "게재 취소" : "게재"}</Button>
                    </div>
                  </div>
                </>
              }
              {/* {(type==="programs" && activeStep === 3) &&
                <>
                  <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}. 프로그램 종료 후 설문조사</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={hasSurvey}
                      onChange={(e) => setHasSurvey(e.target.checked)}
                    />
                  }
                  label={hasSurvey === true ? "설문조사 유" : "설문조사 무"}
                />
                  <div className={styles.main_container}>
                  {hasSurvey &&
                    <>
                      <div style={{marginTop: "15px", marginBottom:"20px", width:"100%"}}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <MobileDateTimePicker
                            label="설문조사 시작일을 선택해주세요."
                            value={surveyStartDate}
                            onChange={(e)=>setSurveyStartDate(e)}
                            renderInput={params => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                      <CustomForm formData={surveyFormData} setFormData={setSurveyFormData} teamId={teamId} contentMode={true} id={id} />
                    </>
                  }
                  </div>
                </>
              } */}
              {(((type==="programs" && activeStep===2)|| (type==="surveys" && activeStep===2)) )&&
                <>
                  <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}. 저장 및 게재</Typography>

                  <div className={styles.main_container}>
                    <div className={styles.container}>
                      <p>저장해도 게재 전까지는 사용자들에게 보여지지 않습니다.</p>
                      <Button variant="text" disabled={isPublished} onClick={onSaveClick} style={{ fontSize: "16px" }}>저장</Button>
                    </div>
                    {type!=="anouncements" && 
                      <div style={{marginTop: "15px", width:"100%"}}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <MobileDateTimePicker
                            label="마감일을 선택해주세요."
                            value={deadline}
                            onChange={(e)=>setDeadline(e)}
                            renderInput={params => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                    }
                    {type==="programs" && 
                      <div style={{marginTop: "25px", width:"100%"}}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <MobileDateTimePicker
                            label="프로그램 시작일을 선택해주세요."
                            value={programStartDate}
                            onChange={(e)=>setProgramStartDate(e)}
                            renderInput={params => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                    }
                    {activeStep === 2 && type==="programs" &&
                      <>
                        {/* <div style={{width:'100%', marginTop:"35px"}}>
                          <div style={{display:"flex", alignContent:"center", alignItems:"center", marginBottom:"12px"}}>
                            <h1>선착순 인원</h1>
                            <Switch checked={hasLimit} onChange={(e)=>{setHasLimit(e.target.checked)}}/>
                            {hasLimit ? "제한있음" : "제한없음"}
                          </div>
                          {hasLimit && <TextField label="선착순 인원" value={limit} onChange={(e)=>setLimit(e.target.value)}/>}
                        </div> */}

                        <div style={{marginTop: "15px", width:"100%", display:"flex", alignItems:"center"}}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MobileDateTimePicker
                              label="예약게재"
                              value={publishStartDate}
                              onChange={(e)=>setPublishStartDate(e)}
                              renderInput={params => <TextField {...params} />}
                            />
                          </LocalizationProvider>
                          <Button onClick={onPublishClick} disabled={!hasSaved}>{hasSaved ? isPublished ? "예약 취소" : "예약" : "저장 후 예약가능"}</Button>
                        </div>
                      </>
                    }
                  
                  {type!=="anouncements"&&
                    <div style={{marginTop: "35px"}}>
                      <p>알림을 보낼 분류를 선택해주세요.</p>
                      <FormControlLabel control={<Switch checked={alarmValues.marriage} onChange={onAlarmValuesChange("marriage")} />} label="결혼이민자" />
                      <FormControlLabel control={<Switch checked={alarmValues.spouse} onChange={onAlarmValuesChange("spouse")} />} label="배우자" />
                      <FormControlLabel control={<Switch checked={alarmValues.children} onChange={onAlarmValuesChange("children")} />} label="자녀" />
                      <FormControlLabel control={<Switch checked={alarmValues.family} onChange={onAlarmValuesChange("family")} />} label="가족" />
                      <FormControlLabel control={<Switch checked={alarmValues.all} onChange={onAlarmValuesChange("all")} />} label="전체" />
                    </div>
                  }
                  

                    <div className={styles.container}>
                    <p>{`컨텐츠가 모든 사용자들에게 표시되며, 마감일 이후 "마감"으로 표시됩니다.`}</p>
                    <p>게재 후엔 내용 변경이 불가능합니다.</p>
                    {isPublished && <Button disabled={true} style={{ fontSize: "16px" }}>게재됨</Button>}
                    <Button variant="text" onClick={onPublishClick} style={{ fontSize: "16px" }}
                      disabled={(deadline===undefined || (!hasSaved && !isPublished))}
                    >{isPublished ? "게재 취소" : "게재"}</Button>
                    </div>
                  </div>
                </>
              }
              
              


              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt:10 }}>
                <Button
                  color="inherit"
                  // disabled={activeStep === 0}
                  onClick={()=>handleBack(activeStep)}
                  sx={{ mr: 1 }}
                >
                  뒤로가기
                </Button>

                <Box sx={{ flex: '1 1 auto' }} />

                <Button
                  color="inherit"
                  // disabled={activeStep === 0}
                  onClick={onPreviewClick}
                  sx={{ mr: 1 }}
                >
                  미리보기
                </Button>

                <Box sx={{ flex: '1 1 auto' }} />   

                <Button onClick={()=>handleNext("finished")}>
                  {activeStep !== steps.length - 1 && '다음'}
                </Button>

              </Box>
            </Card>
        </React.Fragment>
      )}
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleCloseBackDrop}
      >
        {/* {activeStep === 0 &&
          <div style={{width:"400px", height:"700px", backgroundColor:"white", overflow:"scroll"}}>
            <div className="quill_custom_editor" style={{marginTop:"35px"}}>
              <div dangerouslySetInnerHTML={createMarkup()} />
            </div>
          </div>
        }
        {activeStep === 1 && type!=="anouncement" && 
          <div style={{width:"400px", height:"700px", backgroundColor:"white", overflow:"scroll", padding: "10px"}}>
            <Form formDatas={mainFormData} data={[]} handleData={()=>{}} addMargin={true} />
          </div>
        }
        {activeStep === 2 && type!=="survey" && 
          <div style={{width:"400px", height:"700px", backgroundColor:"white", overflow:"scroll", padding: "10px"}}>
            <Form formDatas={surveyFormData} data={[]} handleData={()=>{}} addMargin={true} />
          </div>
        } */}
        {/* {activeStep === 0 && type === "programs" && 
          <div  style={{width:"400px", height:"700px", position:"absolute", backgroundColor:"white", overflow:"scroll", padding: "10px"}}>
            <SwiperContainer data={{
              backgroundColor: values.backgroundColor,
              date: values.date,
              mainThumbnailImg: values.mainThumbnailImg,
              thumbnailBackground: values.thumbnailBackground,
              title: values.title,
              // groupName: teamId,
            }} />
          </div>
        } */}
        {activeStep === 0 && type === "programs" && 
          <div onClick={() => {setTimeout(()=>{setOpenBackdrop(true)},10) }} style={{width:"400px", height:"700px", position:"absolute", backgroundColor:"white", overflow:"scroll", padding: "10px"}}>
            <Article teamId={teamId} id={id} type={type} mode="preview"
              data={{
                title: values.title,
                date: values.date,
                subtitle: values.subtitle,
                infoData: informationList,
                contentData: values.content,
                scheduleData: values.schedule,
                // groupName: values.data().n ame,
                thumbnailBackground: values.thumbnailBackground,
                surveyId: values.surveyId,
                hasSurvey: values.hasSurvey,
                deadline: deadline,
              }}
            />
          </div>
        }
        {activeStep === 1 && type === "programs" && 
          <div style={{width:"400px", height:"700px", backgroundColor:"white", overflow:"scroll", padding: "10px"}}>
            <Form formDatas={mainFormData} data={[]} handleData={()=>{}} addMargin={true} />
          </div>
        }
        {activeStep === 2 && type === "programs" && 
          <div style={{width:"400px", height:"700px", backgroundColor:"white", overflow:"scroll", padding: "10px"}}>
            <Form formDatas={surveyFormData} data={[]} handleData={()=>{}} addMargin={true} />
          </div>
        }
        {activeStep === 0 && type === "surveys" && 
          <div onClick={() => {setTimeout(()=>{setOpenBackdrop(true)},10) }} style={{width:"400px", height:"700px", position:"absolute", backgroundColor:"white", overflow:"scroll", padding: "10px"}}>
            <Article teamId={teamId} id={id} type={type} mode="preview"
              data={{
                title: values.title,
                date: values.date,
                subtitle: values.subtitle,
                infoData: informationList,
                contentData: values.content,
                scheduleData: values.schedule,
                // groupName: values.data().n ame,
                thumbnailBackground: values.thumbnailBackground,
                surveyId: values.surveyId,
                hasSurvey: values.hasSurvey,
                deadline: deadline,
              }}
            />
          </div>
        }
        {activeStep === 1 && type === "surveys" && 
          <div style={{width:"400px", height:"700px", backgroundColor:"white", overflow:"scroll", padding: "10px"}}>
            <Form formDatas={mainFormData} data={[]} handleData={()=>{}} addMargin={true} />
          </div>
        }
        {activeStep === 0 && type === "anouncements" && 
          <div style={{width:"400px", height:"700px", backgroundColor:"white", overflow:"scroll", padding: "10px"}}>
            <ShowArticle createMarkup={createMarkup} data={{title: values.title, subtitle: values.subtitle}} teamId={teamId} id={id} type="anouncement" />
          </div>
        }
      </Backdrop>
    </Box>
  );
}
