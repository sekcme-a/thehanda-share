// ** React Imports
import { useState, useEffect } from 'react'
import { firestore as db } from 'firebase/firebase'
import useData from 'context/data'
// ** MUI Imports
import Box from '@mui/material/Box'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import Timeline from "./Timeline"

import Button from '@mui/material/Button';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';


import AddAlertIcon from '@mui/icons-material/AddAlert';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import TimelineIcon from '@mui/icons-material/Timeline';
// ** Demo Components Imports
import UserViewOverview from './UserViewOverview'

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import Comments from './Comments'
import Family from "./Family"
import Memo from "./Memo"
import ChatView from "./ChatView"
import AlarmSetting from "./AlarmSetting"

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(3)
  }
}))

const UserViewRight = (props) => {
  // ** State
  const [value, setValue] = useState('overview')
  const [timeline, setTimeline] = useState([])
  const {teamId} = useData()
  const [family, setFamily] = useState([])
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const [memo, setMemo] = useState([])

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


  useEffect(() => {
    let list = []
    db.collection("team_admin").doc(teamId).collection("users").doc(props.uid).collection("timeline").orderBy("createdAt", "desc").get().then((query) => {
      query.docs.map((doc) => {
        list.push({...doc.data()})
      })
      setTimeline(list)
    })
    db.collection("user").doc(props.uid).get().then((doc) => {
      if (doc.data().centerAlarm) 
        setAlarmValues(doc.data().centerAlarm)
      if(doc.data().family)
        setFamily(doc.data().family)
    })
    db.collection("team_admin").doc(teamId).collection("users").doc(props.uid).collection("memo").orderBy("createdAt","desc").limit(20).get().then((query)=>{
      if(!query.empty){
        const temp = query.docs.map(doc=>({...doc.data()})) 
        setMemo(temp)
      }
    })
  },[])

  return (
    <TabContext value={value} >
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
      >
        <Tab value='overview' label='Overview' icon={<AccountOutline />} />
        <Tab value='alarmSetting' label='AlarmSetting' icon={<AddAlertIcon />} />
        <Tab value='chat' label="Chat" icon={<ChatOutlinedIcon />} />
        <Tab value='family' label='Family' icon={<FamilyRestroomIcon />} />
        <Tab value='timeline' label='Timeline' icon={<TimelineIcon />} />
        {/* <Tab value='alarmSetting' label='AlarmSetting' icon={<AddAlertIcon />} /> */}
        <Tab value='comments' label="Comments" icon={<SummarizeOutlinedIcon />} />
        <Tab value='memo' label="Memo" icon={<DriveFileRenameOutlineIcon />} />
        
        {/* <Tab value='security' label='Security' icon={<LockOutline />} />
        <Tab value='billing-plan' label='Billing & Plan' icon={<BookmarkOutline />} />
        <Tab value='notification' label='Notification' icon={<BellOutline />} />
        <Tab value='connection' label='Connection' icon={<LinkVariant />} /> */}
      </TabList>
      <Box sx={{ mt: 2 }} >
        <TabPanel sx={{ p: 0 }} value='overview' >
          <Card>
            <UserViewOverview profile_settings={props.profile_settings} additional_data={props.additional_data} />
          </Card>
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='alarmSetting' >
          <Card>
            <AlarmSetting userData={props.userData} />
          </Card>
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='chat'>
          <Card sx={{padding: "10px 20px"}}>
            <ChatView uid={props.uid} teamId={teamId} userName={props.userData.realName} />
          </Card>
        </TabPanel>


        <TabPanel sx={{ p: 0 }} value='timeline'>
          <Card sx={{padding: "10px 20px"}}>
            <Timeline
              timeline={timeline} uid={props.uid} />
          </Card>
        </TabPanel>


        <TabPanel sx={{ p: 0 }} value='family'>
          <Card sx={{padding: "10px 20px"}}>
            <Family family={family}/>
          </Card>
        </TabPanel>


        <TabPanel sx={{ p: 0 }} value='memo'>
          <Card sx={{padding: "10px 20px"}}>
            <Memo memo={memo} uid={props.uid}/>
          </Card>
        </TabPanel>


        <TabPanel sx={{ p: 0 }} value='comments'>
          <Comments uid={props.uid}/>
        </TabPanel>
        {/* <TabPanel sx={{ p: 0 }} value='billing-plan'>
          <UserViewBilling />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='notification'>
          <UserViewNotification />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='connection'>
          <UserViewConnection />
        </TabPanel> */}
      </Box>
    </TabContext>
  )
}

export default UserViewRight
