import { useEffect, useState } from "react"
import styles from "../styles/index.module.css"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import Image from "next/image"

import useData from "context/data"
import { firestore as db } from "firebase/firebase"

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Timeline from '@mui/lab/Timeline';
import TimelineItem,{ timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Backdrop from '@mui/material/Backdrop';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import OpenWebview from "./OpenWebview"

import { motion } from "framer-motion"


const Contents = ({data, teamName, id, type, mode}) => {
  const router = useRouter()
  const { user } = useData()
  const [hasHistory, setHasHistory] = useState(false)
  const [hasEnd, setHasEnd] = useState(false)
  const [hasLimitEnd, setHasLimitEnd] = useState(false)//선착순 마감

  const [isShow, setIsShow] = useState(false)
  const [programSurveyDoc, setProgramSurveyDoc] = useState("")
  const [programSurveyTitle, setProgramSurveyTitle] = useState("")
  const [programSurveyTeam, setProgramSurveyTeam] = useState("")

  const [color, setColor] = useState("white")
  const [selectedItem, setSelectedItem] = useState(0)

  const [openWebview, setOpenWebview] = useState(false)
  const [url, setUrl] = useState("")
  const handleChange = (event, newValue) => {
    setSelectedItem(newValue); 
    console.log(newValue)
    // fetchProgramData(groups[newValue].id)
  };
//4689101112
  useEffect(() => {
    if (data.thumbnailBg === "/thumbnail/003.png" ||
      data.thumbnailBg === "/thumbnail/004.png" ||
      data.thumbnailBg === "/thumbnail/006.png" ||
      data.thumbnailBg === "/thumbnail/008.png" ||
      data.thumbnailBg === "/thumbnail/009.png" ||
      data.thumbnailBg === "/thumbnail/010.png" ||
      data.thumbnailBg === "/thumbnail/011.png"||
      data.thumbnailBg === "/thumbnail/012.png"
    ) {
      setColor("black")
    }

  },[]) 


  const onButtonClick = async() => {
    // if(data.hasSurvey)'
    if(user===null)
      router.push("/login")
    else if(type==="programs"){
      db.collection("user").doc(user.uid).collection("programSurvey").where("hasSubmit","==", false).get().then((query)=>{
        if(query.empty)
          router.push(`/programs/${teamName}/${id}`)
        else{
          query.docs.forEach((doc)=>{
            if(doc.data().deadline.toDate() < new Date()){
              db.collection("user").doc(user.uid).collection("programSurvey").doc(doc.id).delete()
            }
            else{
              setIsShow(true)
              setProgramSurveyDoc(doc.id)
              setProgramSurveyTitle(doc.data().title)
              setProgramSurveyTeam(doc.data().team)
            }
          })
        }
      })
    } else
      router.push(`/surveys/${teamName}/${id}`);
    // else
    //   router.push(`result/${teamName}/${id}`)
  }

  const onCancelClick = async() => {
    if(confirm("신청 취소 하시겠습니까?")){
      const doc = await db.collection("user").doc(user.uid).collection("history").doc(type).get()
      const deleteHistoryResult = doc.data().data.map((item)=>{
        if(item.id!==id)
          return item
      }).filter(Boolean);
    
      const batch = db.batch()
      batch.update(db.collection("user").doc(user.uid).collection("history").doc(type),{data: deleteHistoryResult})
      batch.delete(db.collection("team_admin").doc(teamName).collection("result").doc(id).collection("users").doc(user.uid))
      await batch.commit()
      alert("신청취소되었습니다.")
      setHasHistory(false)
    }
  }

  const createMarkup = (text) => {
    return {__html: text}
  }
  return (
    <div className={styles.main_container}>
      
      <ArrowBackRoundedIcon className={color === "white" ? `${styles.back_button}` : `${styles.back_button} ${styles.black}`} 
        onClick={()=>router.back()}
      />
      <div className={styles.thumbnail_container}>
        <div className={styles.thumbnail_image_container}>
          <Image src={data.thumbnailBg==="/custom" ? data.customBgURL : data.thumbnailBg} alt="배경" layout="fill" objectFit="cover" objectPosition="center" />
          {data.thumbnailBg!=="/custom"&&
            <div className={color === "white" ? `${styles.thumbnail_overlay} ${styles.white}` : `${styles.thumbnail_overlay} ${styles.black}`} >
              {/* <h2 style={{width:"100%"}}>{data.groupName}</h2> */}
              <h2>{data.keyword}</h2>
              <h3>{data.title}</h3>
              <h4>{data.subtitle}</h4>
              <h5>{data.date}</h5>
            </div>
          }
        </div>
      </div>
      <div style={mode==="preview" ? {marginTop:"-329px"} : {marginTop:"0 "}} />
      <div className={styles.info_container}>
        <h3>{data.keyword}</h3>
        <h1>{data.title}</h1>
        <h2>{data.subtitle}</h2>
        {data.info.length!==0 &&
          <div className={styles.info_sub_container}>
            {data.info.map((item, index) => {
              if (item.type === "link")
                return (
                  <Button style={{fontSize:"15px"}} onClick={()=>{setOpenWebview(true); setUrl(item.text)}}>{item.title}</Button>
                )
              return (
                <div className={styles.item_container} key={index}>
                  <h1>{item.title}</h1>
                  <p>{item.text}</p>
                </div>
              )
            })}
          </div>
        }
      </div>


      <Tabs
        value={selectedItem}
        onChange={handleChange}
        // centered
        scrollButtons="auto"
        textColor='secondary'
        indicatorColor='secondary'
        style={{borderBottom:"2px solid rgb(248,248,248)", }}
      >
        <Tab label={type === "surveys" ? "설문조사 정보" : "프로그램 소개"} style={{ margin: "0 10px", fontSize:"15px" }} />
        {type !== "surveys" && <Tab label="프로그램 일정" style={{ margin: "0 10px", fontSize: "15px" }} />}
      </Tabs>

      {console.log(data.publishedDate)}
      {selectedItem === 0 && data.introduce.map((item, index) => {
        return (
          <div className={styles.content_container} key={index}>
            <h1>{item.title}</h1>
            {/* <div className="quill_custom_editor">
              <div dangerouslySetInnerHTML={createMarkup(item.html)} />
            </div> */}
            <p>{item.text}</p>
          </div>
        )
      })}

      
      {selectedItem === 0 && data.introduce?.length === 0 &&
        <div className={styles.no_schedule}>
          <InfoOutlinedIcon sx={{ fontSize: "40px !important" }} />
          {type === "surveys" ? <p>설문조사 정보가 없습니다.</p> : <p>프로그램 소개가 없습니다.</p>}
        </div>
      }
      
      {selectedItem === 1 && data.schedule?.length === 0 &&
        <div className={styles.no_schedule}>
          <EventBusyOutlinedIcon sx={{ fontSize: "40px !important" }} />
          <p>프로그램 일정이 없습니다.</p>
        </div>
      }

      
      {selectedItem === 1 && data.schedule?.length !== 0 &&
        <div className={styles.timeline_container}>
          <Timeline sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}>
            {data.schedule.map((item, index) => {
              return (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="primary" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent style={{paddingBottom:"30px"}}>
                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant='body1' sx={{ mr: 2, fontWeight: "bold", color: 'text.primary' }}>
                        {item.title}
                      </Typography>
                      <Typography variant='caption'>{item.date}</Typography>
                    </Box>
                    <Typography variant='body2' style={{whiteSpace: "pre-wrap", lineHeight:"1.2"}}>{item.text}</Typography>
                  </TimelineContent>
                </TimelineItem>
              )
            })}
          </Timeline>
        </div>
      }
      <div style={{ height: "200px" }}></div>
      {teamName !== undefined && mode!=="preview" && 
        <div className={styles.submit_container}>
          { 
          data.publishStartDate.toDate() > new Date() ? 
            <Button variant="contained" disabled={true} fullWidth >
              <p style={{fontSize:"13px", color:"#333"}}>{`${data.publishStartDate.toDate().toLocaleString()}부터 신청가능합니다.`}</p>
            </Button>
          :
            hasEnd ? 
              <Button onClick={onButtonClick} variant="contained" disabled={true} fullWidth >
                신청 마감
              </Button>
            :
            hasHistory ?
            <Button onClick={onCancelClick} variant="contained" fullWidth color="secondary" >
              신청 취소
            </Button>
            :
            hasLimitEnd ?
              <Button onClick={onButtonClick} variant="contained" disabled={true} fullWidth >
                선착순 마감
              </Button>
            :
            <Button onClick={onButtonClick} variant="contained" fullWidth
              style={{ backgroundColor: "#5316b5" }}>
              신청하기
            </Button>
          }       
        </div>
      }




    <Backdrop
      sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1, display:"flex", justifyContent:"center" }}
      open={isShow}
      onClick={()=>setIsShow(false)}
    >
      <div className={styles.backdrop_container}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1.0 } }}
            style={{ width: "100%", textAlign: "center" }}>
            <div className={styles.alarm_container}>
              <h1>프로그램 설문조사 참여</h1>
              <h2>{`전에 참여했던 "${programSurveyTitle}" 프로그램에 대한 설문조사를 작성해주세요!`}
                <div style={{fontSize:"13px"}}>{`(해당 설문조사를 작성해야 다른 프로그램을 신청하실 수 있습니다.)`}</div>
              </h2>
              <h3 onClick={()=>router.push(`/programSurvey/${programSurveyDoc}`)}>{`설문조사 하러가기 >`}</h3>
            </div>
          </motion.div>
        </div>
      </Backdrop>

      {openWebview && <OpenWebview src={url} open={openWebview} setOpen={setOpenWebview}/>}
    </div>
  )
}

export default Contents