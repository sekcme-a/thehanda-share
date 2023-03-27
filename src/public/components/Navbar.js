import { useEffect, useState } from "react";
import styles from "src/public/styles/navbar.module.css"
import Image from "next/image";
import { useRouter } from "next/router";
import useData from "context/data";

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import GroupIcon from '@mui/icons-material/Group';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import EditNotificationsIcon from '@mui/icons-material/EditNotifications';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BackupTableOutlinedIcon from '@mui/icons-material/BackupTableOutlined';
import SnippetFolderOutlinedIcon from '@mui/icons-material/SnippetFolderOutlined';
import RuleRoundedIcon from '@mui/icons-material/RuleRounded';
import EditNotificationsOutlinedIcon from '@mui/icons-material/EditNotificationsOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

const Navbar = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)
  const [open4, setOpen4] = useState(false)
  const [open5, setOpen5] = useState(false)
  const { teamId, teamName, userData } = useData()

  const handleClick = () => {
    setOpen(!open);
  };
  const handleClick2 = () => {setOpen2(!open2)}
  const handleClick3 = () => {setOpen3(!open3)}
  const handleClick4 = () => {setOpen4(!open4)}
  const handleClick5 = () => {setOpen5(!open5)}

  const uppercase = (text) => {
    return text?.charAt(0).toUpperCase() + text.slice(1)
  }

  const onClick = (loc) => {
    router.push(`/${teamId}/${loc}`)
  }

  return (
    <div className={styles.main_container}>
      {/* <div className={styles.header}>
        <Image src="/logo_2zsoft_no_text.png" width={60} height={45} alt="logo" />
        <div style={{marginLeft: "10px"}}>
          <h1>Admin Team </h1>
          <h2>{uppercase(teamName)}</h2>
        </div>
      </div> */}
   <List
      sx={{ width: '100%', maxWidth: 300, bgcolor: "rgba(255, 255, 255, 0.87)" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
        
      <ListItemButton onClick={handleClick2}>
        <ListItemIcon>
          <PersonOutlineIcon />
        </ListItemIcon>
        <ListItemText primary="사용자 관리" />
        {open2 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open2} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("userList")}>
            <ListItemIcon>
              <RecentActorsIcon />
            </ListItemIcon>
            <ListItemText primary="사용자 목록" />
          </ListItemButton>
        </List>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("userProfileSettings")}>
            <ListItemIcon>
              <FolderSharedIcon />
            </ListItemIcon>
            <ListItemText primary="사용자 프로필 설정" />
          </ListItemButton>
        </List>
        {/* <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("alarmSettings")}>
            <ListItemIcon>
              <EditNotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="알림 타입 설정" />
          </ListItemButton>
        </List> */}
      </Collapse>
        
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary="팀 관리" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("manageTeam")}>
            <ListItemIcon>
              <Diversity3Icon />
            </ListItemIcon>
            <ListItemText primary="구성원 관리" />
          </ListItemButton>
        </List>
        </Collapse>


      <ListItemButton onClick={handleClick3}>
        <ListItemIcon>
          <ArticleOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="게시물 관리" />
        {open3 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open3} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}  onClick={()=>onClick("programCondition")}>
            <ListItemIcon>
              <AccessTimeOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="프로그램 현황" />
          </ListItemButton>
        </List>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}  onClick={()=>onClick("program")}>
            <ListItemIcon>
              <EditRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="프로그램 관리" />
          </ListItemButton>
        </List>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}  onClick={()=>onClick("survey")}>
            <ListItemIcon>
              <EditRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="설문조사 관리" />
          </ListItemButton>
        </List>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}  onClick={()=>onClick("anouncement")}>
            <ListItemIcon>
              <CampaignOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="공지사항 관리" />
          </ListItemButton>
        </List>
        {(userData.roles[1]==="super" || userData.roles[1]==="high") &&
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("confirmProgram")}>
              <ListItemIcon>
                <RuleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="프로그램 승인 관리" />
            </ListItemButton>
          </List>
        }
        {(userData.roles[1]==="super" || userData.roles[1]==="high") &&
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}  onClick={()=>onClick("confirmSurvey")}>
              <ListItemIcon>
                <RuleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="설문조사 승인 관리" />
            </ListItemButton>
          </List>
        }
        {(userData.roles[1]==="super" || userData.roles[1]==="high") &&
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}  onClick={()=>onClick("confirmAnouncement")}>
              <ListItemIcon>
                <RuleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="공지사항 승인 관리" />
            </ListItemButton>
          </List>
        }
      </Collapse>



      {(userData.roles[1]==="super" || userData.roles[1]==="high") &&
      <>
      <ListItemButton onClick={handleClick4}>
        <ListItemIcon>
          <BackupTableOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="섹션 관리" />
        {open4 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open4} timeout="auto" unmountOnExit>

        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}  onClick={()=>onClick("section/program")}>
            <ListItemIcon>
              <SnippetFolderOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="프로그램 섹션" />
          </ListItemButton>
        </List>

        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}  onClick={()=>onClick("section/survey")}>
            <ListItemIcon>
              <SnippetFolderOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="설문조사 섹션" />
          </ListItemButton>
        </List>

        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}  onClick={()=>onClick("section/anouncement")}>
            <ListItemIcon>
              <SnippetFolderOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="공지사항 섹션" />
          </ListItemButton>
        </List>


      </Collapse>
      </>
    }

          {/* <ListItemButton onClick={()=>onClick("contact")}>
            <ListItemIcon>
              <FamilyRestroomIcon />
            </ListItemIcon>
            <ListItemText primary="가족 구성원 관리" />
          </ListItemButton> */}

          <ListItemButton onClick={()=>onClick("contact")}>
            <ListItemIcon>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="센터문의 관리" />
          </ListItemButton>

{/* 
      <>
      <ListItemButton onClick={handleClick5}>
        <ListItemIcon>
          <EditNotificationsOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="알림 보내기" />
        {open5 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open5} timeout="auto" unmountOnExit>

        <List component="div" disablePadding>
          <ListItemButton onClick={()=>onClick("section/program")}>
            <ListItemIcon>
              <NotificationsActiveOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="전체알림 보내기" />
          </ListItemButton>
        </List>

        <List component="div" disablePadding>
          <ListItemButton onClick={()=>onClick("section/survey")}>
            <ListItemIcon>
              <SnippetFolderOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="설문조사 섹션" />
          </ListItemButton>
        </List>

      </Collapse>
      </> */}
    


      {/* <ListItemButton onClick={()=>onClick("program")}>
        <ListItemIcon>
          <EditRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="프로그램 관리" />
      </ListItemButton> */}
        


{/* 
      <ListItemButton onClick={handleClick3}>
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary="프로그램 관리" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("manageTeam")}>
            <ListItemIcon>
              <Diversity3Icon />
            </ListItemIcon>
            <ListItemText primary="구성원 관리" />
          </ListItemButton>
        </List>
      </Collapse> */}
    </List>
    </div>
  )
}

export default Navbar