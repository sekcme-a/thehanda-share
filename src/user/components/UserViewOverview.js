import { useEffect } from "react"

import Form from "src/form/Form.js"

const UserViewOverview = (props) => {

  useEffect(() => {
    console.log(props.profile_settings)
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
      <Form formDatas={props.profile_settings} data={props.additional_data} handleData={handleProfileDataChange}/>
    </div>
  )
}

export default UserViewOverview