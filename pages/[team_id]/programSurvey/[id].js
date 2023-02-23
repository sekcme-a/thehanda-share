import { useEffect, useState } from "react"
import { useRouter } from "next/router";
import styles from "src/[team_id]/index.module.css"

import useData from "context/data";

import { firestore as db } from "firebase/firebase";

import NoAuthority from "src/[team_id]/index/components/NoAuthority"
import LoaderGif from "src/public/components/LoaderGif"
import Navbar from "src/public/components/Navbar"
import Header from "src/public/components/Header"
import Form from "src/form/Form";
import CustomForm from "src/[team_id]/userProfileSettings/components/CustomForm";

import SubContent from "src/public/subcontent/components/SubContent"

import { Button } from "@mui/material";
import { Backdrop } from "@mui/material";
import { MobileDateTimePicker } from '@mui/x-date-pickers'
import { TextField } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ProgramSurvey = () => {
    const router = useRouter()
    const {team_id, id} = router.query
    const { teamId, setTeamId } = useData();
    const [mainFormData, setMainFormData] = useState([])
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [deadline, setDeadline] = useState()

    useEffect(()=>{
      setTeamId(team_id)
    },[])


    const onPreviewClick = () => {
        setOpenBackdrop(true)
      }


    const onSubmitClick = async() => {
        const input = confirm("게재하시겠습니까?\n(게재 후 수정할 수 없습니다.)")
        if(deadline < new Date()){
          alert("마감일은 현재시각보다 과거일 수 없습니다.")
          return
        }
        if(input){
            db.collection("team_admin").doc(teamId).collection("result").doc(id).collection("users").where("hasPart","==", true).get().then(async(query)=>{
                if(query.empty){
                    alert("프로그램에 참여한 인원이 없습니다.\n프로그램에 참여한 인원을 선택한 후 다시 게재해주세요.")
                }
                else{
                  const batch = db.batch()
                  const programDoc = await db.collection("team").doc(team_id).collection("programs").doc(id).get()
                  batch.set(db.collection("team").doc(team_id).collection("programSurvey").doc(id),{
                      formData: mainFormData,
                      title: programDoc.data().title
                  })
                  
                  await query.docs.forEach(async(doc)=>{
                    batch.set(db.collection("user").doc(doc.id).collection("programSurvey").doc(id),{hasSubmit: false, title: programDoc.data().title, team: team_id, deadline: deadline})
                  })
                  await batch.commit()
                  alert("게재되었습니다.")
                  router.push(`/${team_id}/program`)
                }
            })
        }
    }   


    return(
      <div className={styles.main_container}>
      <Header location="programSurvey"/>
      <div className={styles.body_container}>
        <Navbar />
        <div className={styles.content_container}>
                <div style={{display: "flex", justifyContent:"space-between"}}>
                    <div>
                        <h1>프로그램 설문조사는 프로그램에 참여한 사람들에 한해서 전달됩니다.</h1>
                        <h1 style={{color: "red", marginTop:"5px", marginBottom:"15px"}}>*프로그램 설문조사는 게재 후 수정할 수 없습니다.</h1>
                    </div>
                    <Button variant="contained" style={{height:"fit-content"}} onClick={onSubmitClick}>게 재</Button>
                </div>
                <div style={{display:"flex", alignItems:"center",margin: "10px 0 20px 0"}}>
                  <p style={{marginRight:"18px"}}>설문조사 유효기간</p>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDateTimePicker
                      label="마감일을 선택해주세요."
                      value={deadline}
                      onChange={(e)=>setDeadline(e)}
                      renderInput={params => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
                {/* <div style={{width:"400px", height:"700px", backgroundColor:"white", overflow:"scroll", padding: "10px"}}> */}
                    <CustomForm formData={mainFormData} setFormData={setMainFormData} teamName={team_id} contentMode={true} id={id} />
                {/* </div> */}
                <div style={{display:"flex", justifyContent:"center"}}>
                    <Button
                    color="inherit"
                    onClick={onPreviewClick}
                    sx={{ mr: 1 }}
                    >
                    미리보기
                    </Button>
                </div>
            </div>
            <Backdrop
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
                onClick={()=>setOpenBackdrop(false)}
            >
                <div style={{width:"400px", height:"700px", backgroundColor:"white", overflow:"scroll", padding: "10px"}}>
                    <Form formDatas={mainFormData} data={[]} handleData={()=>{}} addMargin={true} />
                </div>
            </Backdrop>
        <div className={styles.sub_content_container}>
          <SubContent />
        </div>
      </div>
    </div>

    )
}

export default ProgramSurvey