import { TextField, Button } from "@mui/material"
import { useState } from "react"
import { firestore as db } from "firebase/firebase"

const Newteam = () => {
    const [values, setValues] = useState({
        id: "",
        name: "",
        uid: ""
    })
    const onValuesChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value})
    }

    const onAddClick = async() => {
        if(values.id!=="" && values.name!=="" && values.uid!==""){
            db.collection("team_admin").doc(values.id).get().then(async(doc)=>{
                if(doc.exists){
                    alert("이미 있는 팀ID입니다.")
                } else{
                    await db.collection("team").doc(values.id).set({
                        id: values.id,
                        teamName: values.teamName,
                    })
                    db.collection("team_admin").doc(values.id).set({
                        id: values.id,
                        teamName: values.name,
                        users: [values.uid]
                    }).then(()=>{
                        db.collection("user").doc(values.uid).get().then((doc2)=>{
                            if(doc2.exists){
                                db.collection("user").doc(values.uid).update({roles: [`admin_${values.id}`, `super`]}).then(()=>{
                                    alert("추가되었습니다.")
                                })
                            }else{
                                alert("없는 UID입니다")
                            }
                        })
                        
                    })
                }
            })
        }
    }

    return(
        <div style={{padding: "20px"}}>
            <TextField id="1" label="팀ID" variant="standard"
                value={values.id} onChange={onValuesChange("id")}
                fullWidth
            />
            <TextField id="2" label="팀명" variant="standard"
                value={values.name} onChange={onValuesChange("name")}
                fullWidth
            />
            <TextField id="3" label="UID" variant="standard"
                value={values.uid} onChange={onValuesChange("uid")}
                fullWidth
            />
            <Button onClick={onAddClick}>팀 추가</Button>
        </div>
    )
}

export default Newteam