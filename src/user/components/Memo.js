import { useState, useEffect } from "react";
import { firestore as db } from "firebase/firebase";
import { TextField } from "@mui/material";
import styles from "../styles/memo.module.css"
import useData from "context/data";
import { Button } from "@mui/material";
// import UndoIcon from '@mui/icons-material/Undo';
// import RedoIcon from '@mui/icons-material/Redo';

const Memo = ({memo, uid}) => {
  const [history, setHistory] = useState(0)
  const [text, setText] = useState("")
  const {user, teamId} = useData()

  useEffect(()=>{
    if(memo.length!==0){
      setText(memo[0].text)
      setHistory(0)
    }
  },[memo])

  const onSubmitClick = () => {
    db.collection("team_admin").doc(teamId).collection("users").doc(uid).collection("memo").doc().set({
      createdAt: new Date(),
      uid: user.uid,
      text: text,
    })
  }

  return(
    <div className={styles.memo_container}>
      <h1>유저 메모를 자유롭게 입력하세요.</h1>
      <p>해당 내용은 같은 팀 내 모든 관리자와 공유됩니다.</p>
      {/* <Button size="small"><UndoIcon /></Button> */}
      <TextField          
        label="유저 메모"
        multiline
        fullWidth
        rows={4}
        value={text}
        placeholder="유저 메모를 입력하세요!"
        onChange={(e)=>setText(e.target.value)}
      />
      <div className={styles.button_container}>
        {/* <Button size="small" style={{marginRight:"30px"}} onClick={onHistoryClick}>저장기록</Button> */}
        <Button variant="contained" size="small" onClick={onSubmitClick}>저장</Button>
      </div>
    </div>
  )
}
export default Memo