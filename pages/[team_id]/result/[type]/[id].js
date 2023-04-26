import { useEffect, useState } from "react";
import { firestore as db } from "firebase/firebase";

import { useRouter } from "next/router"
import styles from "src/[team_id]/index.module.css"
import LoaderGif from "src/public/components/LoaderGif"
import Navbar from "src/public/components/Navbar"
import Header from "src/public/components/Header"
import useData from "context/data";
// import ResultTable from "src/components/admin/ResultTable"
import PageHeader from "src/public/components/PageHeader";
import { CSVDownload, CSVLink } from "react-csv";

import CSVTable from "src/result/components/CSVTable";
import SubContent from "src/public/subcontent/components/SubContent";

import { sendNotification } from "src/public/hooks/notification";

import dynamic from 'next/dynamic'
import { Button } from "@mui/material";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
// import {CsvToHtmlTable} from "react-csv-to-table"
// const CsvToHtmlTable = dynamic(() => import('react-csv-to-table'), { ssr: false })

const Result = () => {
  const router = useRouter()
  const { team_id, type, id } = router.query
  const { user, userrole, setUserrole, setTeamId,teamName } = useData();

  const [headers, setHeaders] = useState()
  const [data, setData] = useState([])

  const [headers2, setHeaders2] = useState()
  const [data2, setData2] = useState([])

  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [alarmText, setAlarmText] = useState("")
  const [isSendingAlarm, setIsSendingAlarm] = useState(false)

  const [hasProgramSurvey, setHasProgramSurvey] = useState(false)

  const [isChildrenMode, setIsChildrenMode] = useState(false)
  
  useEffect(()=>{
    let columnsList = [ 
      { key: "name", label: "실명"},
      { key: "phone", label: "전화번호"},
    ]
    let columnsList2 = [ 
      { key: "name", label: "실명"},
      { key: "phone", label: "전화번호"},
    ]
    setTeamId(team_id)
    sessionStorage.setItem("teamId", team_id)

    const fetchData = async() => {
      await db.collection("team_admin")
      .doc(team_id)
      .collection("result")
      .doc(id)
      .collection("users")
      .orderBy("createdAt", "desc")
      .get()
      .then(async (query) => {
        let rowsList = [];
    
        await Promise.all(
          query.docs.map(async (doc) => {
            let tempArray = []
            const userDoc = await db.collection("user").doc(doc.id).get();
            const tempDataList = {
              relation: "신청자",
              uid: userDoc.id,
              name: userDoc.data().realName,
              phone: userDoc.data().phoneNumber,
              token: userDoc.data().pushToken,
              isAlarmOn: userDoc.data().isAlarmOn,
              alarmSetting: userDoc.data().alarmSetting,
            };
    
            doc.data().data.forEach((item) => {
              if (typeof item.value === "object") {
                if (Array.isArray(item.value)) {
                  tempDataList[item.id] = item.value.join(",");
                } else {
                  tempDataList[item.id] = item.value
                    .toDate()
                    .toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
                    .replace(/\s/g, "");
                }
              } else {
                tempDataList[item.id] = item.value;
              }
            });
    
            tempArray.push(tempDataList);
    
            // 자녀프로그램일시, 자녀들의 데이터도 받아옴
            if (doc.data().selectedMembers) {
              setIsChildrenMode(true);
    
              for (const member of doc.data().selectedMembers) {
                const memberDoc = await db.collection("user").doc(member).get();
                const filtered = userDoc.data().family.filter(item=>item.uid === member)
                let relation = ""
                switch(filtered[0].relation){
                  case "me":
                    relation = "본인"
                    break;
                  case "children":
                    relation="자녀"
                    break;
                  case "spouse":
                    relation="배우자"
                    break;
                  case "parents":
                    relation="부모"
                    break;
                }
                if (memberDoc.exists) {
                  tempArray.push({
                    relation: relation,
                    uid: memberDoc.id,
                    name: memberDoc.data().realName,
                    phone: memberDoc.data().phoneNumber,
                    token: memberDoc.data().pushToken,
                    isAlarmOn: memberDoc.data().isAlarmOn,
                    alarmSetting: memberDoc.data().alarmSetting,
                  });
                }
              }
            }
            rowsList = [...rowsList, ...tempArray]
          })
        );
        console.log(rowsList)
        setData([...rowsList]);
      });
    

      await db.collection("team").doc(team_id).collection(type).doc(id).get().then((doc) => {

        if(doc.data().type==="children" || doc.data().type==="family"){
          columnsList = [{key:"relation", label:"관계"}, ...columnsList]
        }

        setTitle(doc.data().title)
        setAlarmText(`[${doc.data().title}] 프로그램이 내일 시작됩니다.`)
          doc.data().formData.map((item) => {
            columnsList.push({
              label: item.title,
              key: item.id,
            })
          })
        setHeaders(columnsList)
        console.log(columnsList)
      })

      await db.collection("team").doc(team_id).collection("programSurvey").doc(id).get().then(async(doc)=>{
        if(doc.exists){
          setHasProgramSurvey(true)
          await db.collection("team_admin").doc(team_id).collection("programSurveyResult").doc(id).collection("users").get().then((query)=>{
            let rowsList = []
            query.docs.map(async(doc, index)=>{
              const userDoc = await db.collection("user").doc(doc.id).get()
              let tempDataList = {}
              if(userDoc.exists)
                tempDataList = {uid: doc.id, name: userDoc.data().realName, phone: userDoc.data().phoneNumber}
              else
                tempDataList = {uid: doc.id, name: "탈퇴한 사용자", phone: "-"}
              doc.data().data.map((item, index)=>{
                if (typeof (item.value) === "object") {
                  if (item.value.length !== undefined) {
                    let tempString = ""
                    item.value.map((asdf, index) => {
                      if (index === 0)
                        tempString = asdf
                      else
                        tempString = `${tempString},${asdf}`
                    })
                    console.log(tempString)
                    tempDataList = { ...tempDataList, [item.id]: item.value }
                  }
                  else
                  tempDataList = { ...tempDataList, [item.id]: item.value.toDate().toLocaleString('ko-KR').replace(/\s/g, '') }
                } else
                  tempDataList = { ...tempDataList, [item.id]: item.value }
    
                rowsList = [...rowsList,tempDataList]
                console.log(rowsList)
                setData2([...rowsList])
              })
            })
          })
    
          await db.collection("team").doc(team_id).collection("programSurvey").doc(id).get().then((doc) => {
            setTitle(doc.data().title)
              doc.data().formData.map((item) => {
                columnsList2.push({
                  label: item.title,
                  key: item.id,
                })
              })
            setHeaders2(columnsList2)
            console.log(columnsList2)
          })
        }
      })
      
      setIsLoading(false)
    }
    fetchData()

  },[])

  const onSendAlarmClick = () => {
    const tokenList = data.map((item)=>{
      if(item.alarmSetting && item.alarmSetting[team_id])
        return item.token
      else
        return item.token
    })
    const uniqueTokenList = [...new Set(tokenList)]
    console.log(uniqueTokenList)
    setIsSendingAlarm(true)
    Promise.all(
      uniqueTokenList.map(async (token) => {
        try {
          const result = await sendNotification(token,'프로그램 알림', alarmText);
        } catch (e) {
          console.log(e);
        }
      })
    ).then(() => {
      console.log("All notifications sent successfully");
      setIsSendingAlarm(false)
      alert("알림을 성공적으로 전송했습니다.")
      setIsDialogOpen(false)
    }).catch((error) => {
      setIsDialogOpen(false)
      setIsSendingAlarm(false)
      console.log("Error sending notifications: ", error);
    });
  }

  if(isLoading){
    return(
      <></>
    )
  }

  return (
    <div className={styles.main_container}>
    <Header location="result"/>
    <div className={styles.body_container}>
      <Navbar />
      <div className={styles.content_container}>
        <>
        <PageHeader title="폼 결과 확인" subtitle={`"${title}" 폼의 입력 현황입니다.`} mt="40px" />
        {/* <ResultTable /> */}
        {!hasProgramSurvey && type==="programs" && <Button onClick={()=> router.push(`/${team_id}/programSurvey/${id}`)}  variant="contained" size="small">프로그램 설문조사 제작</Button>}
        <div style={{marginTop:"15px"}}/>
        {type==="programs" &&
          <Button onClick={()=>setIsDialogOpen(true)} variant="contained" size="small" style={{backgroundColor:"rgb(255, 153, 51)"}}>
            <NotificationsNoneIcon style={{fontSize:"20px", marginRight:"4px"}} />
            알림 보내기
          </Button>
        }
        <Button  variant="contained" size="small" style={{marginLeft:"20px", backgroundColor:"rgb(51, 153, 255)" }}>
          <ImportExportIcon style={{fontSize:"20px", marginRight:"4px"}}/>
          <CSVLink 
            headers={headers} 
            data={data} 
            filename={`${title}.csv`}
            target="_blank"
            style={{color:"white"}}
          >
            엑셀로 추출
          </CSVLink>
        </Button> 
        <div style={{marginTop:"10px"}}/>
        <CSVTable headers={headers} data={data} type={type} docId={id} isChildrenMode={isChildrenMode}/>


        <div style={{marginTop:"50px"}} />
        {hasProgramSurvey && 
          <>
            <PageHeader title="프로그램 설문조사 결과 확인" subtitle={`"${title}" 프로그램의 설문조사 결과입니다.`} mt="40px" />
            <Button  variant="contained" size="small" style={{marginLeft:"20px", backgroundColor:"rgb(51, 153, 255)" }}>
              <ImportExportIcon style={{fontSize:"20px", marginRight:"4px"}}/>
              <CSVLink 
                headers={headers} 
                data={data} 
                filename={`${title}.csv`}
                target="_blank"
                style={{color:"white"}}
              >
                엑셀로 추출
              </CSVLink>
            </Button> 
            {/* <div style={{marginTop:"10px"}}/>
            <CSVTable headers={headers} data={data} type={type} docId={id} isChildrenMode={isChildrenMode}/> */}
            <div style={{marginTop:"15px"}}/>
            <CSVTable headers={headers2} data={data2} type="programSurveys" docId={id} isChildrenMode={isChildrenMode}/>
          </>
        }
        </>
      </div>
      <div className={styles.sub_content_container}>
        <SubContent />
      </div>
    </div>



    <Dialog open={isDialogOpen} onClose={()=>setIsDialogOpen(false)}>
      {
        !isSendingAlarm ?
        <>
          <DialogTitle>알림 보내기</DialogTitle>
          <DialogContent>
            <DialogContentText>
              알림 문구는 해당 프로그램에 신청한 사용자에게만 전달됩니다. 너무 긴 알림을 보내지 않도록 유의해 주세요.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="알림 문구"
              type="email"
              fullWidth
              variant="standard"
              value={alarmText}
              onChange={(e)=>{setAlarmText(e.target.value)}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setIsDialogOpen(false)}>취소</Button>
            <Button onClick={onSendAlarmClick}>보내기</Button>
          </DialogActions>
        </>
        :
        <>
          <DialogContent>
            <DialogContentText style={{display:"flex", alignItems:"center"}}>알림을 보내고 있습니다. 이 과정은 몇 분 정도 소요될 수 있습니다. <CircularProgress size={25} style={{marginLeft:"15px"}}/></DialogContentText>
          </DialogContent>
        </>
      }
      </Dialog>
  </div>
  )
}

export default Result