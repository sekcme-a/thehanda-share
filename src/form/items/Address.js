import React, { useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import Button from '@mui/material/Button';
import styles from "../items.module.css"
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';


const Address = ({ title, items, index, id, data, handleData,text,isRequired }  ) => {

  const [address, setAddress] = useState(''); // 주소
  const [detailAddress, setDetailAddress] = useState(''); // 상세주소
  const [postNumber, setPostNumber] = useState("")

  
  const [isOpenPost, setIsOpenPost] = useState(false);

  useEffect(() => {
    const index = valueIndex()
    setPostNumber(data[index] ? data[index].value[0] : "")
    setAddress(data[index] ? data[index].value[1] : "")
    setDetailAddress(data[index] ? data[index].value[2] : "")
  },[])

  const onChangeOpenPost = () => {
    setIsOpenPost(!isOpenPost);
  };

  const onCompletePost = (data) => {
    setIsOpenPost(false)
    setPostNumber(data.zonecode)
    setAddress(data.roadAddress)
    console.log(data)
  };

  useEffect(() => {
    controlData()
  },[postNumber, address,detailAddress])

  const controlData = () => {
    let prevData = data
    const value = valueIndex()
    if (value===false)
      prevData.push({id: id, value: [postNumber, address, detailAddress]})
    else 
      prevData[value]["value"] = [postNumber, address, detailAddress]
    
    handleData(prevData)
  }

  const valueIndex = () => {
    for (let i = 0; i < data?.length; i++) {
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
    <div className={styles.address_container} key={index}>
      <div className={styles.single_checkbox_container}>
        <h1>{title}<p>{isRequired && "*필수항목"}</p></h1>
          {
            text &&
            <div className="quill_custom_editor">
              <div dangerouslySetInnerHTML={createMarkup()} />
            </div>
          }
      </div>
      <div className={styles.input_container}>
        <TextField type='number' id='form-props-number' helperText="우편번호" variant="standard" style={{width: "55%"}}
          value={postNumber} onChange={(e)=>setPostNumber(e.target.value)} InputLabelProps={{ shrink: true }}
        />
        <Button variant="text" onClick={onChangeOpenPost}>우편번호 찾기</Button>
        {isOpenPost && <div><DaumPostcode autoClose onComplete={onCompletePost} /></div>}
      <TextField multiline id='textarea-outlined' placeholder='주소' label='주소'variant="standard"
        style={{ width: "100%", marginTop: "0px" }} value={address} onChange={(e)=>setAddress(e.target.value)} maxRows={2} />
      <TextField multiline id='textarea-outlined' placeholder='상세주소' label='상세주소'variant="standard"
        style={{ width: "100%", marginTop: "3px" }} value={detailAddress} onChange={(e)=>setDetailAddress(e.target.value)} maxRows={2} />
      </div>
    </div>
  );
};

export default Address;