
import { TextField } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import styles from "src/credit/credit.module.css"

import { firestore as db } from "firebase/firebase"

const Credit = () => {
  const router = useRouter()
  const ref = useRef()
  const [name, setName] = useState("")
  const [input, setInput] = useState("")
  const [pw, setPw] = useState("")

  const [list, setList] = useState([])

  useEffect(()=>{
    const fetchData = async () => {
      const query = await db.collection("interactive").orderBy("createdAt","asc").limit(150).get()
      if(!query.empty){
        const temp_list = query.docs.map(doc => ({...doc.data(), id: doc.id}))
        setList(temp_list)
      }
      if(ref.current){
        setTimeout(()=>{
          const element = ref.current;
          element.scrollTop = element.scrollHeight;
        },100)
      }
    }
    fetchData()
  },[ref])

  const onSubmit = async () => {
    if(name.length<2 || name.length>8) alert("닉네임은 2글자 이상 8글자 이하여야 합니다.")
    else if (input.length<8) alert("내용은 9글자 이상이여야 합니다.")
    else if (input.length>200) alert("내용은 200글자 이하여야 합니다.")
    else if (pw.length<4) alert("비밀번호는 4자리 이상이여야 합니다.")
    else if(pw.length>15) alert("비밀번호가 너무 깁니다!")
    else {
      await db.collection("interactive").doc().set({
        name: name,
        input: input,
        pw: pw,
        createdAt: new Date()
      })
      alert("성공적으로 작성되었습니다!")
      router.reload()
    }
  }

  const onDeleteClick = async (id,pw) => {
    const userInput = prompt("비밀번호를 입력해주세요:");
    if (userInput !== null) {
      if(pw===userInput){
        await db.collection("interactive").doc(id).delete()
        alert("성공적으로 삭제되었습니다.")
        router.reload()
      } else alert("비밀번호가 일치하지 않습니다.")
    } else {
      console.log("User canceled the input.");
    } 
  }

  return(
    <div className={styles.main_container}>
      <div className={styles.board_container}>
        <h1 className={styles.title}>토론과 방향, 우리도 함께 나누어 봐요</h1>
        <div className={styles.content_container} >
          <div className={styles.chat_container}ref={ref}>
            {list.length===0 && <p style={{fontSize:"12px"}}>아직 작성한 토론이 없습니다.</p>}
            {
              list.map((item,index) => {
                return(
                  <div className={styles.chat} key={index}>
                    <h2>{item.name}<span>{item.createdAt.toDate().toLocaleDateString()}</span><span style={{cursor:"pointer"}}onClick={()=>onDeleteClick(item.id, item.pw)}>수정</span></h2>
                    <p>{item.input}</p>
                  </div>
                )
              })
            }

          </div>
          <div className={styles.input_container}>
            <h1>닉네임</h1>
            <TextField
              variant="standard"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              size="small"
              className={styles.input}
              sx={{input: {color:"white"},}}
            />
            <p>닉네임을 입력해주세요.</p>
            <h1>내용</h1>
            <TextField
              variant="standard"
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              size="small"
              className={styles.input}
              sx={{input: {color:"white"},}}
              multiline
              fullWidth
              maxRows={6}
            />
            <p>내용을 입력해주세요. 최대 200자</p>

            <h1>비밀번호</h1>
            <TextField
              variant="standard"
              value={pw}
              onChange={(e)=>setPw(e.target.value)}
              size="small"
              className={styles.input}
              sx={{input: {color:"white"},}}
            />
            <p>작성 후 비밀번호를 이용해 삭제하실 수 있습니다.</p>
            <p>실제로 사용하지 않는 비밀번호 작성 권장.</p>
            

            <div className={styles.button} onClick={onSubmit}>
              작성
            </div>
            <p style={{marginTop:"10px"}}>*취지와 맞지 않은 토론은 무통보 삭제될 수 있습니다.</p>
          </div>
        </div>










        <div className={styles.board_border_top} />
        <div className={styles.board_border_left} />
        <div className={styles.board_border_right} />
        <div className={styles.board_bottom} />
        <div className={styles.people_container}>
          <img src="/images/credit.png" alt="만든이들"/>
          <h1 onClick={()=>router.push("/")}>{`<      처음으로`}</h1>
        </div>
        <h1 className={styles.special_thanks}>
        본 기획물은 정부광고 수수료로 조성된 언론진흥기금의 지원을 받았습니다.
        </h1>
      </div>
    </div>
  )
}

export default Credit