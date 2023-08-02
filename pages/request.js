import { Button, TextField } from "@mui/material"
import { firestore as db } from "firebase/firebase"
import { useEffect, useState } from "react"
import styles from "request/request.module.css"

const Request = () => {
  const [list, setList] = useState([])
  const [input, setInput] = useState("")

  useEffect(()=> {
    const fetchData = async () => {
      const query = await db.collection("benefitRequest").get()
      const list_temp = query?.docs?.map(doc => ({ ...doc.data(), id: doc.id }));
      if(list_temp)
        setList(list_temp)
    }
    fetchData()
  },[])

  const onAcceptClick = async (id) => {
    // const doc = await db.collection("user").doc(id).collection("message").doc("status").get()
    const batch = db.batch()

    // if(!doc.exists)
    //   batch.set(db.collection("user").doc(id).collection("message").doc("status"), {unread: 1})
    // else 
    //   batch.update(db.collection("user").doc(id).collection("message").doc("status"), {unread: doc.data().unread+1}) 
    batch.set(db.collection("user").doc(id).collection("message").doc(),{
      mode: "benefitRequestAccept",
      read: true,
      title:"제휴 신청이 승인되었습니다.",
      repliedAt: new Date(),
    })
    batch.update(db.collection("user").doc(id),{hasBenefitPost: true})
    batch.delete(db.collection("benefitRequest").doc(id))
    await batch.commit()
    alert("승인성공")
  }

  const onDeclineClick = async (id) => {
    const batch = db.batch()
    batch.set(db.collection("user").doc(id).collection("message").doc(),{
      mode: "benefitRequestDecline",
      read: true,
      title:`제휴 신청이 거절되었습니다. 거절사유: ${input}`,
      repliedAt: new Date(),
    })
    batch.delete(db.collection("benefitRequest").doc(id))

    await batch.commit()
    alert("거절 성공")
  }
  return(
    <div className={styles.main_container}>
      <TextField
        label="거절사유"
        variant="standard"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        // multiline={false} rows={1} maxRows={1}
        size="small"
        fullWidth
        sx={{mb:"30px"}}
      />
    {
      list.map((item, index) => {
        return(
          <li key={index}>
            <h1>상호: {item.companyName}</h1>
            <p>혜택 : {item.benefits}</p>
            <Button onClick ={() => onAcceptClick(item.id)} variant="contained">승인</Button>
            <Button onClick ={() => onDeclineClick(item.id)} variant="contained" color="error" sx={{ml:"20px"}}>거절</Button>
          </li>
        )
      })
    }
    </div>
  )
}

export default Request