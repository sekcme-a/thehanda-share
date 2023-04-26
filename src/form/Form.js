import { useEffect, useState } from "react"
import styles from "./items.module.css"

import SingleCheckbox from "./items/SingleCheckbox"
import MultipleCheckbox from "./items/MultipleCheckbox"
import ListSelect from "./items/ListSelect"
import NumberSelect from "./items/NumberSelect"
import SmallInput from "./items/SmallInput"
import FreeInput from "./items/FreeInput"
import DateTime from "./items/DateTime"
import PhoneNumber from "./items/PhoneNumber"
import Address from "./items/Address"
import Image from "./items/Image"
import File from "./items/File"

const Form = ({ formDatas, data, handleData, addMargin }) => {
  useEffect(() => {
    console.log(formDatas)
  },[formDatas])

  const createMarkup = (data) => {
    return {__html: data}
  }


  return (
    <div className={styles.form_container}>
      {
        formDatas.map((formData, index) => {
          if(formData.type==="text_area")
            return(
              <>
                <div dangerouslySetInnerHTML={createMarkup(formData.text)} />
              </>
            )
          if (formData.type === "single_checkbox")
            return (
              <>
                <div style={addMargin && { marginBottom: "1px" }} key={index}>
                  <SingleCheckbox index={index}
                    id={formData.id} title={formData.title} items={formData.items}
                    data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
                  />
                </div>

              </>
            )
          else if (formData.type === "multiple_checkbox")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><MultipleCheckbox index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "list_select")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><ListSelect index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "number_select")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><NumberSelect index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "small_input")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><SmallInput index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "free_input")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><FreeInput index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "date_time")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><DateTime index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "phone_number")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><PhoneNumber index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "address")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><Address index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "image")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><Image index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "file")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><File index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
      })}
    </div>
  )
}

export default Form