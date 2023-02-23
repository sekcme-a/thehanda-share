import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import { firestore as db } from "firebase/firebase"

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';

import useData from "context/data"
import { firebaseHooks } from "firebase/hooks"



// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 13,
  bottom: 0,
  height: 185,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    height: 165,
    position: 'static'
  }
}))

const DialogEditUser = (props) => {
  const { teamId } = useData()
  const router = useRouter()
  const [code, setCode] = useState("")
  const handleChange = (event) => {
    setCode(event.target.value);
    setHelperValues({...helperValues, mode:"", text: "코드를 작성해주세요."})
  };
  const [helperValues, setHelperValues] = useState({
    isShow: true,
    text: "코드를 작성해주세요.",
    mode: ""
  })

  //quick style
  const CARD_WIDTH = 800
  const TITLE_WIDTH = 10
  const TITLE_MARGIN_BOTTOM = 2



  const onButtonClick = async () => {
    try {
      let result
      if(props.mode==="add")
        result = await firebaseHooks.give_admin_role_with_user_uid(code, teamId)
      else if(props.mode==="delete")
        result = await firebaseHooks.delete_admin_role_with_user_uid(code, teamId)
      else 
        result = await firebaseHooks.give_authority(code, props.mode, teamId)
      setHelperValues({ ...helperValues, text: result, mode:"success" })
    } catch (e) {
      setHelperValues({ ...helperValues, text: e, mode:"error" })
      console.log(e)
    }
  }
  return (
    <Card sx={{ position: 'relative', overflow: 'visible', mt: { xs: 0, sm: 7.5, md: 0 }, width:`${CARD_WIDTH}px` }}>
      <CardContent sx={{ p: theme => `${theme.spacing(8.25, 7.5, 1.25, 7.5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={TITLE_WIDTH}>
            <Typography variant='h5' sx={{ mb: TITLE_MARGIN_BOTTOM }}>
              {props.mode === "add" ?
                "팀의 구성원으로 초대할 사용자의 코드를 입력해주세요!"
                :
                props.mode==="delete" ? "팀의 구성원에서 삭제할 사용자의 코드를 입력해주세요!"
                :
                `${props.mode}권한을 부여할 사용자의 코드를 입력해주세요.`
              }
            </Typography>
            <div style={{display: "flex", alignItems:"center"}}>
              <FormControl variant="standard" sx={{mb: 3}} color={helperValues.mode}>
                <InputLabel htmlFor="component-helper">CODE</InputLabel>
                <Input
                  id="component-helper"
                  value={code}
                  onChange={handleChange}
                  aria-describedby="component-helper-text"
                />
                <FormHelperText id="component-helper-text" style={{color: helperValues.mode==="success" && "green"}} error={helperValues.mode==="error"}>
                  {helperValues.isShow && helperValues.text}
                </FormHelperText>
              </FormControl>
              <Button variant="text" sx={{ ml: 1, mt: -3 }} onClick={onButtonClick}>{props.mode === "add" ? "추가" : "삭제"}</Button>
            </div>
            {(props.mode==="add" || props.mode==="delete") &&<Typography variant='body2'>코드를 통해 구성원을 {props.mode === "add" ? "추가" : "삭제"}하세요.</Typography>}
            <Typography variant='body2'>
              {props.mode === "add" ?
                "구성원이 되면 팀에 접근하는 모든 데이터 권한이 허용됩니다."
                :
                props.mode === "delete" && "구성원에서 제외하면 팀에 접근하는 모든 데이터 권한이 차단됩니다."
              }
            </Typography>
          </Grid>
          <StyledGrid item xs={12} sm={6}>
            <Img alt='Congratulations John' src="/illustration_john.png" />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default DialogEditUser


