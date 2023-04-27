import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import useData from 'context/data';

import { firestore as db } from 'firebase/firebase';
import { Dialog, TextField } from '@mui/material';

const AlarmSetting = ({userData}) => {
  const [isAlarmOn, setIsAlarmOn] = useState(true)
  const {teamId, alarmType, setAlarmType} = useData()
  const [isLoading, setIsLoading] = useState(true)
  const [dialogMode, setDialogMode] = useState("hidden")
  const [input, setInput] = useState("")
  const [alarmDetail, setAlarmDetail] = useState({})

  useEffect(()=>{
    const fetchData = async () => {
      setIsAlarmOn(userData.alarmSetting[teamId])
      if(alarmType.length===0){
        await db.collection("team_admin").doc(teamId).get().then((doc) => {
          if(doc.data().alarmType)
            setAlarmType(doc.data().alarmType)
        })
      }
      const userDoc = await db.collection("user").doc(userData.uid).get()
      if(userDoc.data().alarmDetail)
        setAlarmDetail(userDoc.data().alarmDetail)
      setIsLoading(false)
    }
    fetchData()
  },[])

  const onAddTypeClick = () => {
    setDialogMode("add")
  }

  const onDeleteTypeClick = () => {
    setDialogMode("delete")
  }


  const onAddClick = async() => {
    if(alarmType?.length>0){
      if(includesText(alarmType, input)){
        alert("이미 있는 타입입니다.")
        return
      }
    }
    const randomDoc = await db.collection("user").doc().get()
    const randomId = randomDoc.id
    await db.collection("team_admin").doc(teamId).update({
      alarmType: [...alarmType, {id: randomId, text: input}]
    })
    alert("성공적으로 추가되었습니다.")
    setAlarmType([...alarmType, {id: randomId, text: input}])
    setInput("")
    setDialogMode("hidden")
  }

  const onDeleteClick = async () => {
    if(alarmType?.length>0){
      if(includesText(alarmType, input)){
        const newAlarmType = alarmType.filter((item) => item.text !== input)
        await db.collection("team_admin").doc(teamId).update({
          alarmType: newAlarmType
        })
        alert("성공적으로 삭제되었습니다.")
        setAlarmType(newAlarmType)
        setInput("")
        setDialogMode("hidden")
      }else{
        alert("없는 타입입니다.")
        return
      }
    } else {
      alert("삭제할 타입이 없습니다.")
    }
    
  }

  function includesText(array, text) {
    for (let obj of array) {
      for (let key in obj) {
        if (typeof obj[key] === "string" && obj[key]===text) {
          return true;
        }
      }
    }
    return false;
  }

  const onAlarmValuesChange = (id) => {
    setAlarmDetail({...alarmDetail, [id]: !alarmDetail[id]})
  }

  useEffect(()=>{
    console.log(alarmDetail)
  },[alarmDetail])


  const onSubmitClick = async () => {
    await db.collection("user").doc(userData.uid).update({alarmDetail: alarmDetail})
    alert("적용되었습니다.")
  }



  if(isLoading)
    return <></>

  return(
    <>
      <Card sx={{padding: "10px 20px"}}>
      <div style={{marginTop: "15px"}}>
      <p>해당 사용자의 분류를 선택해주세요. {`(분류에 따라 알림이 전송됩니다.)`} <Button style={{fontSize: "16px"}} onClick={onSubmitClick} variant="contained" size="small">적용</Button></p>
      {/* <p style={{fontSize:"14px"}}>{`(해당 사용자의 알림이 꺼져있다면 알림이 보내지지 않습니다.)`} </p> */}
        {isAlarmOn ? 
        <div style={{fontSize:"14px", marginTop:"10px"}}>해당 사용자의 알림이 켜져있습니다. </div>
          :
          <>
            <div style={{fontSize:"14px", marginTop:"10px", lineHeight:"1.2", wordBreak:"keep-all"}}>해당 사용자의 알림이 꺼져있습니다.{`(해당 사용자가 알림을 껐을 경우 알림은 보낼 수 없습니다.)`}</div>
          </>
        }
      
        <div style={{marginTop: "20px"}}/>
          <Button variant='contained' onClick={onAddTypeClick} size="small">알림 타입 추가 +</Button>
          <Button variant='contained' onClick={onDeleteTypeClick} size="small" sx={{ml:"20px", bgcolor:"rgb(200,0,0)"}}>알림 타입 삭제 -</Button>
            {/* <FormControlLabel control={<Switch checked={alarmValues.marriage} onChange={onAlarmValuesChange("marriage")} />} label="결혼이민자" />
            <FormControlLabel control={<Switch checked={alarmValues.spouse} onChange={onAlarmValuesChange("spouse")} />} label="배우자" />
            <FormControlLabel control={<Switch checked={alarmValues.children} onChange={onAlarmValuesChange("children")} />} label="자녀" />
            <FormControlLabel control={<Switch checked={alarmValues.family} onChange={onAlarmValuesChange("family")} />} label="가족" />
            <FormControlLabel control={<Switch checked={alarmValues.all} onChange={onAlarmValuesChange("all")} />} label="전체" /> */}
          </div>
          {alarmType.map((item, index) => {
            return(
              <FormControlLabel key={index} control={<Switch checked={alarmDetail[item.id]} onChange={()=>onAlarmValuesChange(item.id)} />} label={item.text} />
            )
          })}
      </Card>

      <Dialog open={dialogMode==="add"} onClose={()=>setDialogMode("hidden")}>
        <div style={{padding:"30px 50px"}}>
          <h1>추가할 타입명을 입력해주세요.</h1>
          <div style={{marginTop:"20px"}}>
            <TextField value={input} onChange={(e) => setInput(e.target.value)} size="small" label="타입명"/>
            <Button onClick={onAddClick} variant='contained' sx={{ml:"20px"}}>추가</Button>
          </div>
        </div>
      </Dialog>
      <Dialog open={dialogMode==="delete"} onClose={()=>setDialogMode("hidden")}>
        <div style={{padding:"30px 50px"}}>
          <h1>삭제 타입명을 입력해주세요.</h1>
          <div style={{marginTop:"20px"}}>
            <TextField value={input} onChange={(e) => setInput(e.target.value)} size="small" label="타입명"/>
            <Button onClick={onDeleteClick} variant='contained' sx={{ml:"20px"}}>삭제</Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default AlarmSetting