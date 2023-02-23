import { useEffect, useState } from "react"
import { firestore as db } from "firebase/firebase"
import useData from "context/data"

// ** MUI Import
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'

// ** Icons Imports
import ArrowRight from 'mdi-material-ui/ArrowRight'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import PhoneDialOutline from 'mdi-material-ui/PhoneDialOutline'
import Backdrop from '@mui/material/Backdrop';

import Form from "src/form/Form.js"

// Styled Timeline component
const Timeline = styled(MuiTimeline)({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

// Styled component for the image of a shoe
const ImgShoe = styled('img')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius
}))


const TimelineLeft = ({ timeline, uid }) => {
  const [openForm, setOpenForm] = useState(false)
  const [formData, setFormData] = useState([])
  const [inputData, setInputData] = useState([])
  const { teamId } = useData()
  
  const onOpenFormClick = (type, docId) => {
    if(type==='programSurveys'){
      db.collection("programSurvey").doc(docId).get().then((doc)=>{
        if(doc.exists)
          setFormData(doc.data().form)
        else
          alert("삭제된 게시물이거나 없는 데이터입니다.")
      })
      db.collection("programSurvey").doc(docId).collection("result").doc(uid).get().then((doc)=>{
        if(doc.exists)
        setInputData(doc.data().data)
      else
        alert("삭제된 게시물이거나 없는 데이터입니다.")
      })
    } else{
      db.collection("team").doc(teamId).collection(type).doc(docId).get().then((doc) => {
        if(doc.exists)
          setFormData(doc.data().formData)
        else
          alert("삭제된 게시물이거나 없는 데이터입니다.")
      })
      db.collection("team_admin").doc(teamId).collection("result").doc(docId).collection("users").doc(uid).get().then((doc) => {
        if(doc.exists)
          setInputData(doc.data().data)
        else
          alert("삭제된 게시물이거나 없는 데이터입니다.")
      })
    }
    setOpenForm(true)
  }
  return (
    <>
    <Timeline >
      {timeline.map((item, index) => (
        <TimelineItem key={index}>
          <TimelineSeparator>
            <TimelineDot color='error' />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                {item.title}
              </Typography>
              <Typography variant='caption'>{item.createdAt.toDate().toLocaleString('ko-KR').replace(/\s/g, '')}</Typography>
            </Box>
            <Typography variant='body2'>{item.text}</Typography>
            <p style={{ fontSize: "14px", textDecoration: "underline", color: "blue", cursor: "pointer" }}
              onClick={()=>onOpenFormClick(item.type, item.docId)}
            >입력 데이터 보기</p>
            {/* <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2'>자세히 보기</Typography>
            </Box> */}
          </TimelineContent>
        </TimelineItem>
      ))}
      </Timeline>
        <Backdrop
          sx={{ color: 'black', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openForm}
          onClick={()=>setOpenForm(false)}
      >
        <div style={{width:"400px", height:"600px", overflowY:"scroll", backgroundColor:"white", padding:'10px 20px'}}>
          <Form formDatas={formData} data={inputData} handleData={()=>{}}/>

        </div>
      </Backdrop>
    </>
  )
}

export default TimelineLeft
