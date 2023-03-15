import { useEffect, useState } from "react"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import styles from "../items.module.css"

const MultipleCheckbox = ({ title, items, index, id, data, handleData,text,isRequired }) => {
  const [value, setValue] = useState("")
  const [selectedList, setSelectedList] = useState([])
  useEffect(() => {
    for (let i = 0; i < data?.length; i++) {
      if (data[i].id === id) {
        setSelectedList(data[i].value)
      }
        
    }
  },[])

  // const onChange = (e) => {
  //   let hasData = false
  //   let prevData = data

  //   if (value === "") {
  //     prevData.push({id: id, value: e.target.value})
  //   } else {
  //     for (let i = 0; i < data.length; i++) {
  //       if (data[i].id === id) {
  //         prevData[i]["value"] = e.target.value
  //       }
  //     }
  //   }
  //   handleData(prevData)
  //   setValue(e.target.value)
  // }

  const onRadioClick = (e) => {
    !selectedList.includes(e.target.value)
      ? setSelectedList((selectedList)=>[...selectedList, e.target.value])
      : setSelectedList(selectedList.filter((cate) => cate !== e.target.value))
  }

  useEffect(() => {
    let hasData = false
    let prevData = data

    if (value === "") {
      prevData.push({id: id, value: selectedList})
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          prevData[i]["value"] = selectedList
        }
      }
    }
    handleData(prevData)
    setValue(selectedList)
  },[selectedList])
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
        {/* <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        > */}
        <div className={styles.multiple_checkbox_container}>
          {items.map((item, index) => { 
              return (
                <FormControlLabel key={index} value={item} control={<Radio checked={selectedList.includes(item)} />} label={item}
                  onClick={onRadioClick}  />
              )
            })
          
          }
        </div>
    </div>  
  );
}
export default MultipleCheckbox