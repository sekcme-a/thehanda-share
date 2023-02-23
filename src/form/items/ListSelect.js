import { useEffect, useState } from "react"
import styles from "../items.module.css"
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const ListSelect = ({ title, items, index, id, data, handleData,text,isRequired }) => {
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
    let hasData = false
    let prevData = data
    const value = valueIndex()
    if (value===false)
      prevData.push({id: id, value: e.target.value})
    else 
      prevData[value]["value"] = e.target.value
    
    handleData(prevData)
    setValue(e.target.value)
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
      <TextField
        id="standard-select-currency"
        select
        value={value}
        onChange={onChange}
        helperText=""
        variant="standard"
        style={{width: "100%"}}
      >
        {items.map((item,index) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
    </div>  
  );
}
export default ListSelect