import { useEffect, useState } from "react"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import styles from "../items.module.css"

const SingleCheckbox = ({ title, items, index, id, data, handleData,text,isRequired }) => {
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
    let prevData = data

    if (value === "") {
      prevData.push({id: id, value: e.target.value})
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          prevData[i]["value"] = e.target.value
        }
      }
    }
    handleData(prevData)
    setValue(e.target.value)
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
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={value}
          onChange={onChange}
        >
          {items.map((item, index) => {
              return (
                <FormControlLabel key={index} value={item} control={<Radio />} label={item} />
              )
            })
          
          }
        </RadioGroup>
    </div>  
  );
}
export default SingleCheckbox