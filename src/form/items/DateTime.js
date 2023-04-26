import { useEffect, useState } from "react"
import styles from"../items.module.css"

import Box from '@mui/material/Box' 
import { TimePicker } from '@mui/x-date-pickers'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDatePicker } from '@mui/x-date-pickers'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
// import { TimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers';

const DateTime = ({ title, items, index, id, data, handleData,text,isRequired  }) => {
  const [value, setValue] = useState(new Date())
  useEffect(() => {
    console.log(items)
    for (let i = 0; i < data?.length; i++) {
      if (data[i].id === id) {
        setValue(data[i].value.toDate())
      }
        
    }
  },[])

  const onChange = (e) => {
    console.log(e)
    setValue(e)
    controlData(e)
    // if (isValueValueable(e.target.value)) {
    //   controlData(e.target.value)
    // }
  }

  const isValueValueable = (value) => {
    return true
  }

  const controlData = (targetValue) => {
    let prevData = data
    const value = valueIndex()
    if (value===false)
      prevData.push({id: id, value: targetValue})
    else 
      prevData[value]["value"] = targetValue
    
    handleData(prevData)
    setValue(targetValue)
  }

  const valueIndex = () => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        return i
      }
    }
    return false
  }
  
  const createMarkup = () => {
    return {__html: text}
  }

  return (
    <div className={styles.single_checkbox_container} key={index}>
      <h1>{title}<p>{isRequired && "*필수항목"}</p></h1>
        {
          text &&
          <div className="quill_custom_editor">
            <div dangerouslySetInnerHTML={createMarkup()} />
          </div>
        }
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: "20px" }} className='demo-space-x'>
        {items === "date" &&
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDatePicker
              label={title}
              value={value}
              onChange={onChange}
              renderInput={params => <TextField {...params} sx={{ width: "100%" }} />}
            />
          </LocalizationProvider>
        }
        {items === "time" &&
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label={title}
              value={value}
              onChange={onChange}
              renderInput={params => <TextField {...params} sx={{ width: "100%" }} />}
            />
          </LocalizationProvider>
        }
        {items === "date_time" &&
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDateTimePicker
              label={title}
              value={value}
              onChange={onChange}
              renderInput={params => <TextField {...params} sx={{ width: "100%" }} />}
            />
          </LocalizationProvider>
        }
      </Box>
    </div>  
  );
}
export default DateTime 