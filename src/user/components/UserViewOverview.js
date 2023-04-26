import { useEffect } from "react"

import Form from "src/form/Form.js"

const UserViewOverview = (props) => {

  useEffect(() => {
    console.log(props.profile_settings)
    console.log(props.additional_data)
  },[])
  const handleProfileDataChange = () => {

  }
  const backgroundStyle = {
    // backgroundColor: "white",
    padding: "10px 20px",
    // borderRadius: "3px"
  }
  return (
    <div style={backgroundStyle}>
      {props.additional_data ?
        <Form formDatas={props.profile_settings} data={props.additional_data} handleData={handleProfileDataChange}/>
        :
        <p style={{width:"100%", display:"flex", justifyContent:"center"}}>해당 사용자가 추가 프로필을 입력하지 않았습니다.</p>
      }
    </div>
  )
}

export default UserViewOverview