import { useEffect, useState } from "react"
import styles from "../styles/subContent.module.css"
import { firestore as db } from "firebase/firebase"
import { CircularProgress } from "@mui/material"
import useData from "context/data"
import { Button } from "@mui/material"
import { useRouter } from "next/router"
import { TempleBuddhist } from "mdi-material-ui"
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import History from "./History"
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Dialog } from "@mui/material"
import QRCodeGenerator from "src/public/components/QRCodeGenerator"

const ProgramInfo = ({subContent}) => {
  const {teamId, setSubContent, user} = useData()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState()
  const router = useRouter()
  const [author, setAuthor] = useState()
  const [team, setTeam] = useState([])
  const [isHistoryDetail, setIsHistoryDetail] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [isCopied, setIsCopied] = useState(false);


  useEffect(()=>{
    const fetchData = async () => {
      const doc = await db.collection("team").doc(teamId).collection(subContent.type).doc(subContent.id).get()
      if(doc.exists)
        setData(doc.data())
      const userDoc = await db.collection("user").doc(doc.data().author).get()
      if(userDoc)
        setAuthor({id: userDoc.id, name: userDoc.data().displayName})

        let teamList = [];
        Promise.all(
          doc.data().team.map((id) => {
            return db.collection("user").doc(id).get().then((res) => {
              if(res.exists)
                teamList.push({ id: id, name: res.data().displayName, photoUrl: res.data().photoUrl });
            });
          })
        ).then(() => {
          console.log(teamList);
          setTeam([...teamList])
        });
      
      setIsLoading(false)
    }
    setIsLoading(true)
    fetchData()
  },[subContent])

  const onEditClick = () => {
    setSubContent({type:"programEdit", id: subContent.id})
    router.push(`/${teamId}/editProgram/${subContent.id}`)
  }

  const onResultClick = () => {
    setSubContent({type:"resultLog", id: subContent.id})
    router.push(`/${teamId}/result/${subContent.type}/${subContent.id}`)
  }

  const onShareClick = () => {
    setOpenDialog(true)
  }

  const onURLCopyClick = async() => {
    
    try {
      await navigator.clipboard.writeText(`https://dahanda.netlify.app/preview/${teamId}/${subContent.id}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset state after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  if(isLoading)
    return(
      <div className={styles.loading}><CircularProgress />  </div>
    )
  return(
    <div className={styles.program_info_container}>
      <h1>제목: {data.title}</h1>
      <h1>부제목: {data.subtitle}</h1>
      {/* <div className={styles.border} /> */}
      <div className={styles.border} />
      <h1>상태:    
        {data.condition==="unconfirm" && " 미승인"}
        {data.condition==="confirm" && data.publishStartDate > new Date() && " 예약게재"}
        {data.condition==="confirm" && data.publishStartDate <= new Date() && " 게재중"}
        {data.condition==="decline" && " 반려"}
        {data.condition==="waitingForConfirm" && " 승인대기"}
      </h1>
      {data.condition==="confirm" && <h1>게제일: {data.publishStartDate.toDate().toLocaleString()}</h1>}
      {data.condition==="confirm" && <h1>마감일: {data.deadline.toDate().toLocaleString()}</h1>}
      <div className={styles.border} />

      <h1>최초 생성자: {author.name}</h1>
      <History data={data.history} />
      {/* <h1>작성자</h1>
      <div className={styles.avatar_container}>
        <AvatarGroup max={6}>
          {team?.map((item, index) => {
            return(
              <Tooltip title={item.name} key={index} >
                <Avatar alt={item.name} src={item.photoUrl}/>
              </Tooltip>
            )
          })}
        </AvatarGroup>
      </div> */}
      {/* {team.some((obj) => obj.id === user.uid) && 
        <Button fullWidth variant="contained" style={{fontSize:"16px", paddingTop:'0px', paddingBottom:"0px", marginTop: "0px", backgroundColor:"blue"}} size="small" onClick={onAddAuthorClick}>작성자 추가 +</Button>
      } */}

    
      <Button fullWidth variant="contained" style={{fontSize:"16px", paddingTop:'0px', paddingBottom:"0px", marginTop: "40px"}} size="small" onClick={onEditClick}>편 집</Button>
      {data.condition==="confirm" && data.publishStartDate <= new Date() &&
      <Button fullWidth variant="contained" style={{fontSize:"16px", paddingTop:'0px', paddingBottom:"0px", marginTop: "15px", backgroundColor:"olivedrab"}} size="small" onClick={onResultClick}>결과보기</Button>
      }
      {data.condition==="confirm" && 
      <Button fullWidth variant="contained" style={{fontSize:"16px", paddingTop:'0px', paddingBottom:"0px", marginTop: "15px", backgroundColor:"#007aff"}} size="small" onClick={onShareClick}>배포하기</Button>
      }
      {/* <Button fullWidth variant="contained" style={{fontSize:"16px", paddingTop:'0px', paddingBottom:"0px", marginTop: "15px", backgroundColor:"rgb(155,144,121)"}} size="small" onClick={onResultClick}><NotificationsNoneIcon />알림보내기</Button> */}
      <Dialog open={openDialog} onClose={()=>{setOpenDialog(false); setIsCopied(false)}}>
        <div className={styles.dialog_container}>
          <div style={{display:"flex", justifyContent:"center"}}>
            <QRCodeGenerator url={`https://dahanda.netlify.app/preview/${teamId}/${subContent.id}`}/>
          </div>
          <div className={styles.url_container}>
            <h2 style={{marginBottom:"20px"}}>해당 QR코드를 스크린샷으로 저장해 배포하세요!</h2>
            <p style={{fontWeight:"bold"}}>배포 URL</p>
            <div className={styles.url_text}>
              <h1>{`https://dahanda.netlify.app/preview/${teamId}/${subContent.id}`}</h1>
              <Button size="small" onClick={onURLCopyClick}>{isCopied ? "복사되었습니다." : "클릭하여 URL복사"}</Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ProgramInfo