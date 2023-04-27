// ** React Imports
import { useState, useEffect } from 'react'

import useData from 'context/data'
import { firestore as db } from 'firebase/firebase'
import styles from "../styles/alarmType.module.css"

import SortableComponent from 'src/public/components/SortableComponent'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import AvatarGroup from '@mui/material/AvatarGroup'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog' 
import PageHeader from 'src/public/components/PageHeader'
import { TextField } from '@mui/material'
import { SeatIndividualSuite } from 'mdi-material-ui'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';


const AlarmType = ({mode}) => {
  const {teamId, alarmType, setAlarmType} = useData()
  const [items, setItems] = useState([])
  const [components, setComponents] = useState([])
  const [value, setValue] = useState("")
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const fetchData = async () => {
      console.log(teamId)
      setIsLoading(true)
      let tempItems = []
      const doc = await db.collection("team").doc(teamId).collection("section").doc(mode).get()
      if(doc.exists){
        setItems(doc.data().data)
        tempItems=doc.data().data
      } else{
        setItems([])
      }
      let temp = []
      for (let i =0 ; i<tempItems.length; i++){
        temp.push(renderComponent(tempItems[i]))
      }
      setComponents([...temp])
      setIsLoading(false)
    }
    fetchData()
  },[])


  useEffect(()=>{
    console.log(items)
  },[items])

  const onAddSectionClick = () => {
      setDialogMode("add")
      setIsOpenDialog(true)
  }
  const onAddClick = async() => {
    for(const item of items){
      if(item.name===value){
        alert("이미 있는 알람명입니다.")
        setIsLoading(false)
        return
      }
    }
    if(value==="" || value===" "){
      alert("알람은 빈칸일 수 없습니다.")
      return
    }
 
    const doc = await db.collection("team").doc(teamId).collection("section").doc().get()
    const tempItems = [...items, {name: value, id: doc.id, createdAt: new Date().toLocaleDateString()}]
    setItems([...tempItems])
    let temp = []
    for (let i =0 ; i<tempItems.length; i++){
      temp.push(renderComponent(tempItems[i]))
    }
    setComponents([...temp])
    setIsOpenDialog(false)
    setValue("")
  }

  const onDeleteSectionClick = () => {
    setDialogMode("delete")
    setIsOpenDialog(true)
  }
  const onDeleteClick = () => {
    let hasItem = false
    let temp =[]
    let temp2 = []
    for(const item of items){
      if(item.name===value)
        hasItem = true
      else{
        temp.push(item)
        temp2.push(renderComponent(item))
      }
    }
    if(hasItem){
      if(!confirm("알람을 삭제하시겠습니까?"))
        return
      setItems([...temp])
      setComponents([...temp2])
      setValue("")
      setIsOpenDialog(false)
    }else
      alert("일치하는 알람명이 없습니다.")
  }


  const renderComponent = (data) => {
    return(
      <div className={styles.item}>
        <h1>{data.name}</h1>
        <p>등록일 : {data.createdAt}</p>
      </div>
    )
  }

  const onSubmitClick = () => {
    if(confirm("해당 내용을 적용하시겠습니까? (적용 즉시 어플에 적용됩니다.)")){
      db.collection("team").doc(teamId).collection("section").doc(mode).set({
        data: items
      }).then(()=>{
        alert("적용되었습니다.")
      })
    }
  }

  if(isLoading)
    return(<></>)

  return(
    <>
      <PageHeader title="알람 타입" subtitle="알람 타입을 추가/삭제 할 수 있습니다." mt="20px"/>
                
      <Grid container spacing={3} className='match-height'>


        <Grid item xs={14} sm={6} lg={6}>
          <Card
            sx={{ cursor: 'pointer', height: "125px" }}
          >
            <Grid container sx={{ height: '100%' }}>
              <Grid item xs={5}>
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <img width={65} height={120} alt='add-role' src='/david_standing.png' />
                </Box>
              </Grid>
              <Grid item xs={7}>
                <CardContent>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography style={{wordBreak: "keep-all"}}>현재 알람 타입 갯수</Typography>
                  </Box>
                  <Box sx={{textAlign:'right', mt: "10px"}}>
                    <h1 style={{fontSize:"30px"}}>{`${items.length}개`}</h1>
                  </Box>
                </CardContent>
              </Grid>
              
            </Grid>
          </Card>
        </Grid>


        <Grid item xs={14} sm={6} lg={6}>
          <Card
            sx={{ cursor: 'pointer', height: "125px" }}
            onClick={() => {
              onAddSectionClick()
            }}
          >
            <Grid container sx={{ height: '100%' }}>
              <Grid item xs={5}>
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <img width={65} height={120} alt='add-role' src='/john_standing.png' />
                </Box>
              </Grid>
              <Grid item xs={7}>
                <CardContent>
                  <Box sx={{ textAlign: 'right' }}>
                    <Button
                      variant='contained'
                      sx={{ mb: 1, whiteSpace: 'nowrap' }}
                      onClick={() => {
                        onAddSectionClick()
                      }}
                    >
                      알람 추가
                    </Button>
                    <Typography style={{wordBreak: "keep-all"}}>알람을 추가합니다.</Typography>
                  </Box>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>


        <Grid item xs={14} sm={6} lg={6}>
          <Card
            sx={{ cursor: 'pointer', height: "125px" }}
            onClick={() => {
              onDeleteSectionClick()
            }}
          >
            <Grid container sx={{ height: '100%' }}>
              <Grid item xs={5}>
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <img width={65} height={120} alt='add-role' src='/john_standing.png' />
                </Box>
              </Grid>
              <Grid item xs={7}>
                <CardContent>
                  <Box sx={{ textAlign: 'right' }}>
                    <Button
                      variant='contained'
                      sx={{ mb: 1, whiteSpace: 'nowrap', backgroundColor:"rgb(133, 34, 25)" }}
                      onClick={() => {
                        onDeleteSectionClick()
                      }}
                    >
                      알람 삭제
                    </Button>
                    <Typography style={{wordBreak: "keep-all"}}>알람을 삭제합니다.</Typography>
                  </Box>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>



      </Grid>


      <PageHeader title={mode==="program" ? "프로그램 알람": "설문조사 알람"}subtitle="" mt="40px"/>

      <SortableComponent items={items} setItems={setItems}
        components={components} setComponents={setComponents} mode="y" ulStyle={{ width: "100%" }} pressDelay={150} />
      <div className={styles.button_container}>
        <Button variant="contained" onClick={onSubmitClick}>적용</Button>
      </div>

      <Dialog open={isOpenDialog} onClose={()=>setIsOpenDialog(false)}>
        {dialogMode==="add" &&
          <div className={styles.dialog_container}>
            <h1>추가할 알람명을 입력해주세요</h1>
            <TextField variant="standard" value={value} onChange={(e)=>setValue(e.target.value)}/>
            <Button onClick={onAddClick}>추가</Button>
          </div>
        }
        {dialogMode==="delete" &&
          <div className={styles.dialog_container}>
            <h1>삭제할 알람명을 입력해주세요</h1>
            <TextField variant="standard" value={value} onChange={(e)=>setValue(e.target.value)}/>
            <Button onClick={onDeleteClick}>삭제</Button>
          </div>
        }
      </Dialog>

    </>
  )
}

export default AlarmType