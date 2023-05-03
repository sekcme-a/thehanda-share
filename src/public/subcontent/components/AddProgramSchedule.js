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
  const {userData, teamId, programSchedule, setProgramSchedule} = useData()
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
    allDay: false,
  })

  useEffect(()=>{
    if(programSchedule){
      setColorValues({...programSchedule.colorValues})
    }
  },[programSchedule])

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
    setProgramSchedule({...programSchedule, colorValues: colorValues})
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



    </div>
  )
}
export default AddSchedule