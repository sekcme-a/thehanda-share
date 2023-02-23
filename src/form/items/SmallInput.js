import { useEffect, useState } from "react"
import TextField from '@mui/material/TextField';
import styles from "../items.module.css"

const SmallInput = ({ title, items, index, id, data, handleData,text,isRequired }) => {
  const [value, setValue] = useState("")
  useEffect(() => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        console.log(data[i].value)
        setValue(data[i].value)
      }
        
    }
  },[])

  const onChange = (e) => {
    if (isValueValueable(e.target.value)) {
      controlData(e.target.value)
    }
  }

  const isValueValueable = (value) => {
    if(value.length<=100)
      return true
    return false
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
      <TextField multiline id='textarea-outlined' placeholder='' 
        style={{ width: "100%", marginTop: "12px" }} value={value} onChange={onChange} />
    </div>  
  );
}
export default SmallInput