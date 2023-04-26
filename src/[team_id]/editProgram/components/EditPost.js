import { Checkbox } from "@mui/material"
import styles from "../styles/editPost.module.css"
import { useEffect, useState } from "react"

import useData from "context/data"

import DropperImage from  "./DropperImage"

import SelectMultipleChip from "src/mui/SelectMultipleChip"
import BasicSelect from "src/mui/BasicSelect"
import Editor from "src/public/components/Editor"

import { TextField } from "@mui/material"
import { SelectMultiple } from "mdi-material-ui"
import { MenuItem } from "@mui/material"
import { Button } from "@mui/material"

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

import { firestore as db } from "firebase/firebase"


//textfield 디자인
const textfieldStyle = {style:{fontSize:"14px"}}

const backgroundItems = [
  {value:"/background/black.jpg", text:"검은색"},
  {value:"/background/blue.jpg", text:"파란색"},
  {value:"/background/darkblue.jpg", text:"짙은파란색"},
  {value:"/background/green.jpg", text:"초록색"},
  {value:"/background/orange.jpg", text:"주황색"},
  {value:"/background/purple.jpg", text:"보라색"},
  {value:"/background/red.jpg", text:"빨간색"},
  {value:"/background/.jpg", text:"노란색"},
]

const thumbnailBgItems = [
  { value: "/custom", text: "[직접제작]" },
  { value: "/thumbnail/001.png", text: "파란피카소" },
  { value: "/thumbnail/002.png", text: "한국전통배경1" },
  { value: "/thumbnail/003.png", text: "한국전통배경2" },
  { value: "/thumbnail/004.png", text: "복주머니" },
  { value: "/thumbnail/005.png", text: "야자수" },
  { value: "/thumbnail/006.png", text: "화난선생" },
  { value: "/thumbnail/007.png", text: "겨울선물" },
  { value: "/thumbnail/008.png", text: "바닷모래" },
  { value: "/thumbnail/009.png", text: "엄지척남자" },
  { value: "/thumbnail/010.png", text: "꽃다발" },
  { value: "/thumbnail/011.png", text: "집" },
  { value: "/thumbnail/012.png", text: "가을남자" },
  { value: "/thumbnail/013.png", text: "보름달뜬밤" },
]

const EditPost = ({values, setValues, sections, fileId,type}) => {
  const [sectionItems, setSectionItems] = useState([])
  const [selectedSections, setSelectedSections] = useState([])
  const {teamId} = useData()

  const onHtmlChange = (html, index) => {
    onIntroChange(index, "html", html)
  }

  useEffect(()=>{

    const fetchSection = async() => {
      const sectionsNameArray = sections.map(section=>section.name)
      setSectionItems(sectionsNameArray)
  
      const selectedSectionNameArray = await Promise.all(values.sections.map(section => {
        return db.collection("team").doc(teamId).collection("section").doc(type).get()
          .then(sectionDoc => {
            console.log(section.id)
            if (sectionDoc.data().data.some(item => item.id === section.id)) {
              return section.name;
            }
          })
      }).filter(Boolean));
      console.log(selectedSectionNameArray)
      if(selectedSectionNameArray[0])
        setSelectedSections(selectedSectionNameArray)
    }
    fetchSection()
  },[])

  //Handle section_select value************
  useEffect(()=>{
    console.log(selectedSections)
    const selected = sections.map(item => {
      for (const selectedSection of selectedSections) {
        if (selectedSection === item.name) {
          return {name: item.name, id: item.id}
        }
      }
    }).filter(Boolean);
    onValuesChange("sections", selected)
  },[selectedSections])

  const handleSelectedBackgroundItem = (selectedItem) => {
    onValuesChange("mainBg", selectedItem)
  }
  const handleSelectedThumbnailBgItem = (selectedItem) => {
    onValuesChange("thumbnailBg", selectedItem)
  }
  const handleSelectedInfoItem = (e, index) => {
    onInfoChange(index, "type", e)
  }

  const handleThumbnailBgURL = (url) => {
    onValuesChange("customBgURL", url)
  }

  const onValuesChangeWithEvent = (prop) => (event) => {
    setValues({...values, [prop]: event.target.value})
  }

  const onValuesChange = (key, value) => {
    setValues({...values, [key]: value})
  }

  //handle 등급(isMain)
  const onIsMainChange = (e) => {
    setValues({...values, ["isMain"]: e.target.checked})
  }
  const onIsCommonChange = (e) => {
    setValues({...values, ["isMain"]: !e.target.checked})
  }




  const onAddInfoClick = () => {
    onValuesChange("info",[...values.info, {type:"text", title:"", text:""}])
  }
  const onDeleteInfoClick = (n) => {
    const temp = values.info.map((item, index) => index!==n && item ).filter(Boolean)
    onValuesChange("info",[...temp])
  }
  const onInfoChange = (index, type, value) => {
    const changedValue = values.info.map((item, i) => i === index ? { ...item, [type]: value } : item)
    setValues({...values, info: [...changedValue]})
  }

  const onAddIntroClick = () => {
    onValuesChange("introduce",[...values.introduce, {title:"", text:""}])
  }
  const onDeleteIntroClick = (n) => {
    const temp = values.introduce.map((item, index) => index!==n && item ).filter(Boolean)
    onValuesChange("introduce",[...temp])
  }
  const onIntroChange = (index, type, value) => {
    const changedValue = values.introduce.map((item, i) => i === index ? { ...item, [type]: value } : item)
    if (type === "title") {
      if (changedValue[0].title!==values.introduce[index].title) {
        setValues({ ...values, introduce: [...changedValue] })
      }
    }
    else if (type === "html")
      console.log([...changedValue])
      if (changedValue[0].html !== values.introduce[index].html)
        setValues({ ...values, introduce: [...changedValue] })
  }

  const onAddScheduleClick = () => {
    onValuesChange("schedule",[...values.schedule, {date: "", title:"", text:""}])
  }
  const onDeleteScheduleClick = (n) => {
    const temp = values.schedule.map((item, index) => index!==n && item ).filter(Boolean)
    onValuesChange("schedule",[...temp])
  }
  const onScheduleChange = (index, type, value) => {
    const changedValue = values.schedule.map((item, i) => i === index ? { ...item, [type]: value } : item)
    setValues({...values, schedule: [...changedValue]})
  }

  const onTypeChange = (checked, target) => {
    if(checked)
      setValues({...values, type: target})
    else if(target==="common"){
      alert("타입은 없을 수 없습니다.")
    } else
      setValues({...values, type: "common"})
  }




  return(
    <div className={styles.main_container}>
      {type!=="survey" &&
        <>
          <div className={styles.item_container}>
            <h1>등급</h1>
            <div className={styles.checkbox}>
              <Checkbox size="small" style={{paddingRight:"4px"}} checked={values.isMain} onChange={onIsMainChange}/>
              <p>메인 프로그램</p>
            </div>
            <div className={styles.checkbox}>
              <Checkbox size="small" style={{paddingRight:"4px"}} checked={!values.isMain} onChange={onIsCommonChange}/>
              <p>일반 프로그램</p>
            </div>
          </div>

          <div className={styles.item_container}>
            <h1>타입</h1>
            <div className={styles.checkbox}>
              <Checkbox size="small" id="common" style={{paddingRight:"4px"}} checked={values.type==="common"} onChange={(e)=>onTypeChange(e.target.checked, e.target.id)}/>
              <p>일반</p>
            </div>
            <div className={styles.checkbox}>
              <Checkbox size="small" id="children" style={{paddingRight:"4px"}} checked={values.type==="children"} onChange={(e)=>onTypeChange(e.target.checked, e.target.id)}/>
              <p>자녀</p>
            </div>

          </div>
        </>
      }
      <div className={styles.item_container}>
        <h1>상태</h1>
        <div className={styles.checkbox}>
          <Checkbox size="small" style={{paddingRight:"4px"}} checked={values.condition==="confirm"}/>
          <p>승인됨</p>
        </div>
        <div className={styles.checkbox}>
          <Checkbox size="small" style={{paddingRight:"4px"}} checked={values.condition==="waitingForConfirm"}/>
          <p>승인대기</p>
        </div>
        <div className={styles.checkbox}>
          <Checkbox size="small" style={{paddingRight:"4px"}} checked={values.condition==="unconfirm"}/>
          <p>미승인</p>
        </div>
        <div className={styles.checkbox}>
          <Checkbox size="small" style={{paddingRight:"4px"}} checked={values.condition==="decline"}/>
          <p>반려</p>
        </div>
      </div>
      <div className={styles.border} />

      <div className={styles.item_container}>
        <h1>섹션</h1>
        <div className={styles.checkbox}>
          <SelectMultipleChip title="섹션선택" items={sectionItems} selectedItems={selectedSections} setSelectedItems={setSelectedSections}/>
          {/* <MuiSelectChip title="프로그램 섹션" items={sections} onValuesChange={onValuesChange}/> */}
        </div>
      </div>
      <div className={styles.border} />
      

      <div className={styles.text_container}>
        <h1>제목</h1>
        <TextField size="small" placeholder="제목을 입력하세요." value={values.title} fullWidth onChange={onValuesChangeWithEvent("title")}InputProps={textfieldStyle}/>
      </div>
      <div className={styles.text_container}>
        <h1>부제목</h1>
        <TextField size="small" placeholder="부제목을 입력하세요." value={values.subtitle} fullWidth multiline onChange={onValuesChangeWithEvent("subtitle")}InputProps={textfieldStyle}/>
      </div>
      <div className={styles.text_container}>
        <h1>기간문구</h1>
        <TextField size="small" placeholder="기간문구를 입력하세요." value={values.date} fullWidth onChange={onValuesChangeWithEvent("date")}InputProps={textfieldStyle}/>
      </div>
      <div className={styles.text_container}>
        <h1>키워드</h1>
        <TextField size="small" placeholder="키워드를 입력하세요." value={values.keyword} fullWidth onChange={onValuesChangeWithEvent("keyword")}InputProps={textfieldStyle}/>
      </div>
      <div className={styles.border} />


      {values.isMain &&
        <div className={styles.text_container}>
          <h1 style={{width:"105px"}}>배경 색상</h1>
          <div className={styles.checkbox}>
            <BasicSelect title="배경 색상을 선택해주세요" size="small" width={300} items={backgroundItems} selectedItem={values.mainBg} handleSelectedItem={handleSelectedBackgroundItem}/>
          </div>
        </div>
      }
      <div style={{height: "1px"}} />
      <div className={styles.text_container}>
        <h1 style={{width:"105px"}}>썸네일 배경</h1>
        <div className={styles.checkbox}>
          <BasicSelect title="썸네일 배경을 선택해주세요" size="small" width={300} items={thumbnailBgItems} selectedItem={values.thumbnailBg} handleSelectedItem={handleSelectedThumbnailBgItem}/>
        </div>
      </div>
      {values.thumbnailBg==="/custom" &&
        <div className={styles.text_container}>
          <h1>썸네일 업로드</h1>
          <DropperImage setImgURL={handleThumbnailBgURL} path={`content/${teamId}/${fileId}`} imgURL={values.customBgURL} />
        </div>
      }
      <div className={styles.border} />

      <div className={styles.info_container}>
        <h1>정보창 작성</h1>
        <div className={styles.info_item_container}>
          {values.info?.map((item,index) => {
            return(
              <div key={index} className={styles.item}>
                <BasicSelect title="타입" size="small" width={120} items={[{value:"text", text:"제목/내용"},{value:"link", text:"링크"}]}
                  selectedItem={item.type} handleSelectedItem={(e)=>handleSelectedInfoItem(e, index)}
                />
                <div style={{width:"5px"}}/>
                <TextField value={item.title} onChange={(e)=>onInfoChange(index, "title", e.target.value)} sx={{width:160}} size="small" label="제목"></TextField>
                <div style={{width:"5px"}}/>
                <TextField value={item.text} onChange={(e)=>onInfoChange(index, "text", e.target.value)} size="small" multiline={item.type==="text"}
                  label={item.type==="text" ? "내용" : "링크 (http://이나 https://를 포함시켜야합니다.)"} placeholder={item.type==="link" && "https://www.naver.com"} sx={{width: 320}} />
                <DeleteOutlineRoundedIcon style={{color: "red", paddingLeft:"10px", paddingTop:"5px"}} onClick={()=>onDeleteInfoClick(index)}/>
              </div>
            )
          })}
          <Button variant="contained" size="small" onClick={onAddInfoClick}>정보 추가</Button>
        </div>
      </div>
      <div className={styles.border} />


      <div className={styles.info_container}>
        <h1>{type==="survey" ? "설문조사 정보" : "프로그램 소개"}</h1>
        <div className={styles.info_item_container}>
          {values.introduce?.map((item,index) => {
            return(
              <div key={index} className={styles.item2}>
                <TextField value={item.title} onChange={(e)=>onIntroChange(index, "title", e.target.value)} sx={{width:160}} size="small" label="제목"></TextField>
                <DeleteOutlineRoundedIcon style={{color: "red", paddingLeft:"10px", paddingTop:"5px", cursor:"pointer"}} onClick={()=>onDeleteIntroClick(index)}/>
                <div style={{width:"100%", height:"10px"}}/>
                {/* <TextField value={item.text} onChange={(e)=>onIntroChange(index, "text", e.target.value)} size="small" multiline
                  label="내용" sx={{width: 445}} /> */}
                <Editor path={`content/${fileId}`} handleChange={onHtmlChange} textData={item.html} index={index} />
                
              </div>
            )
          })}
          <Button variant="contained" size="small" onClick={onAddIntroClick}>소개 추가</Button>
        </div>
      </div>
      <div className={styles.border} />

      {type!=="survey"&&
        <div className={styles.info_container}>
          <h1>프로그램 일정</h1>
          <div className={styles.info_item_container}>
            {values.schedule?.map((item,index) => {
              return(
                <div key={index} className={styles.item}>
                  <TextField value={item.date} onChange={(e)=>onScheduleChange(index, "date", e.target.value)} sx={{width:160}} size="small" label="날짜"></TextField>
                  <div style={{width:"5px"}}/>
                  <TextField value={item.title} onChange={(e)=>onScheduleChange(index, "title", e.target.value)} sx={{width:160}} size="small" label="제목"></TextField>
                  <div style={{width:"5px"}}/>
                  <TextField value={item.text} onChange={(e)=>onScheduleChange(index, "text", e.target.value)} size="small" multiline
                    label="내용" sx={{width: 250}} />
                  <DeleteOutlineRoundedIcon style={{color: "red", paddingLeft:"10px", paddingTop:"5px"}} onClick={()=>onDeleteScheduleClick(index)}/>
                </div>
              )
            })}
            <Button variant="contained" size="small" onClick={onAddScheduleClick}>일정 추가</Button>
          </div>
        </div>
      }
      <div className={styles.border} />



    </div>
  )
}
export default EditPost