import { useEffect, useState } from "react"
import useData from "context/data"
import { useRouter } from "next/router"
import styles from "../styles/AddSchedule.module.css"
import { firestore as db } from "firebase/firebase"
import { Button, ButtonBase, Checkbox, TextField } from "@mui/material"

import { MobileDateTimePicker } from '@mui/x-date-pickers'
// import { TimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { FormControlLabel } from "@mui/material"
import Select from '@mui/material/Select';

const AddSchedule = () => {
  const {userData, teamId, calendar, setCalendar} = useData()
  const router = useRouter()
  const [colorValues, setColorValues] = useState({
    red:"",
    orange:"",
    yellow:"",
    green:"",
    blue:"",
    purple:""
  })
  const [values, setValues] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    // start: new Date().toDateString(),
    // end: new Date().toDateString(),
    // allDay: true,
    extendedProps: {
      memo: '',
      id: Math.floor(Math.random() * 100000) + 1,
      url:""
    },
    color: "red",
    allDay: true,
  })

  useEffect(()=>{
    if(calendar){
      setColorValues({...calendar.colorValues})
    }
  },[calendar])

  const onColorValueChange= (color, value) => {
    setColorValues({...colorValues, [color]: value})
  }
  const onValuesChange = (type, value) => {
    setValues({...values, [type]: value})
  }
  const onMemoChange = (value) => {
    setValues({...values, extendedProps:{...values.extendedProps, memo: value}})
  }
  const onUrlChange = (value) => {
    setValues({...values, extendedProps:{...values.extendedProps, url: value}})
  }

  const onColorSubmit = () => {
    // db.collection("team_admin").doc(teamId).update({
    //   calendar: {...calendar, colorValues: colorValues}
    // }).then(()=>{
    //   setCalendar({...calendar, colorValues: colorValues})
    //   console.log({...calendar, colorValues: colorValues})
    // })
    setCalendar({...calendar, colorValues: colorValues})
  }

  const onSubmitClick = () => {
    console.log(calendar)
    if(calendar.data){
      setCalendar({
        ...calendar,
        data: [
          ...calendar.data,
          values
        ]
      })
    } else {
      setCalendar({
        ...calendar,
        data:[
          values
        ]
      })
    }
    setValues({
      url: '',
      title: '',
      start: new Date(),
      end: new Date(),
      // start: new Date().toDateString(),
      // end: new Date().toDateString(),
      // allDay: true,
      extendedProps: {
        memo: '',
        id: Math.floor(Math.random() * 100000) + 1,
        url:""
      },
      color: "red",
      allDay: true,
    })

  }

  return(
    <div className={styles.schedule_container}>
      <h1>색깔에 따른 타입 지정</h1>
      <div className={styles.color_container}>
        <div className={`${styles.dot} ${styles.red}`} />
        <p>빨강: </p>
        <TextField variant="standard" value={colorValues.red} onChange={(e)=>onColorValueChange("red",e.target.value)}/>
      </div>
      <div className={styles.color_container}>
        <div className={`${styles.dot} ${styles.yellow}`} />
        <p>노랑: </p>
        <TextField variant="standard" value={colorValues.yellow} onChange={(e)=>onColorValueChange("yellow",e.target.value)}/>
      </div>
      <div className={styles.color_container}>
        <div className={`${styles.dot} ${styles.green}`} />
        <p>초록: </p>
        <TextField variant="standard" value={colorValues.green} onChange={(e)=>onColorValueChange("green",e.target.value)}/>
      </div>
      <div className={styles.color_container}>
        <div className={`${styles.dot} ${styles.blue}`} />
        <p>파랑: </p>
        <TextField variant="standard" value={colorValues.blue} onChange={(e)=>onColorValueChange("blue",e.target.value)}/>
      </div>
      <div className={styles.color_container}>
        <div className={`${styles.dot} ${styles.purple}`} />
        <p>보라: </p>
        <TextField variant="standard" value={colorValues.purple} onChange={(e)=>onColorValueChange("purple",e.target.value)}/>
      </div>
      <div className={styles.button_container}>
        <Button variant="contained" size="small" onClick={onColorSubmit}>저장</Button>
      </div>



      <h1 style={{marginTop:"30px"}}>일정 추가</h1>
      <TextField variant="standard" sx={{mt:"5px"}} fullWidth size="small" label="제목*" value={values.title} onChange={(e)=>onValuesChange("title", e.target.value)}/>
      <TextField variant="standard" sx={{mt:"5px"}} fullWidth size="small" label="이동할 주소" placeholder="https://dahanda.netlify.app/" value={values.extendedProps.url} onChange={(e)=>onUrlChange(e.target.value)}/>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDateTimePicker
          label="시작일*"
          value={values.start}
          onChange={(e)=>onValuesChange("start", e)}
          renderInput={params => <TextField {...params} sx={{ width: "100%" }} variant="standard" style={{marginTop:"5px"}}/>}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDateTimePicker
          label="종료일*"
          value={values.end}
          onChange={(e)=>onValuesChange("end", e)}
          renderInput={params => <TextField {...params} sx={{ width: "100%" }} variant="standard" style={{marginTop:"5px"}}/>}
        />
      </LocalizationProvider>

      <FormControlLabel
        control={
          <Checkbox checked={values.allDay} onChange={(e)=>onValuesChange("allDay", e.target.checked)}/>
        }
        label="종일 일정" sx={{mt:"5px"}}
      />

      <FormControl fullWidth sx={{mt:"13px"}}>
        {/* <InputLabel id="demo-simple-select-label">색깔</InputLabel> */}
        <p style={{fontSize:"12px", marginBottom:"5px"}}>색상선택*</p>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={values.color}
          label="색깔"
          onChange={(e)=>onValuesChange("color", e.target.value)}
          size="small"
          variant="standard"

        >
          <MenuItem value="red">빨강</MenuItem>
          <MenuItem value="yellow">노랑</MenuItem>
          <MenuItem value="green">초록</MenuItem>
          <MenuItem value="blue">파랑</MenuItem>
          <MenuItem value="purple">보라</MenuItem>
        </Select>
      </FormControl>

      <TextField variant="standard" multiline  sx={{mt:"5px"}} fullWidth size="small" label="추가 메모" value={values.extendedProps.memo} onChange={(e)=>onMemoChange(e.target.value)}/>

      <div className={styles.button_container}>
      <Button onClick={onSubmitClick} variant="contained" size="small">일정 추가 +</Button>
      </div>

    </div>
  )
}
export default AddSchedule