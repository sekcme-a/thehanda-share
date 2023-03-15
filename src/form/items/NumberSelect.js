import { useEffect, useState } from "react"
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import styles from "../items.module.css"
import TextField from '@mui/material/TextField';

const NumberSelect = ({ title, items, index, id, data, handleData,text,isRequired }) => {
  const [value, setValue] = useState("")
  useEffect(() => {
    for (let i = 0; i < data?.length; i++) {
      if (data[i].id === id) {
        setValue(data[i].value)
      }
    }
  },[])

  const onChange = (e) => {
    if ((-100000000 < parseInt(e.target.value) && parseInt(e.target.value) < 100000000)||e.target.value==="") {
      let prevData = data
      const value = valueIndex()
      if (value===false)
        prevData.push({id: id, value: e.target.value})
      else 
        prevData[value]["value"] = e.target.value
      
      handleData(prevData)
      setValue(e.target.value)
    }
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
      <TextField type='number'  id='form-props-number' variant="standard" style={{width: "100%"}}
        value={value} onChange={onChange} InputLabelProps={{ shrink: true }}
      />
    </div>    
  );
}
export default NumberSelect