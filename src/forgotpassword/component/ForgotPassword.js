import styles from "../styles/forgotPassword.module.css"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"

import useData from "context/data"

import { firestore as db, auth } from "firebase/firebase"

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import ChevronLeft from 'mdi-material-ui/ChevronLeft'

const ForgotPassword = (props) => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState(" ")
  const [isSendEmail, setIsSendEmail] = useState(false)
  const onEmailChange = (e) => { setEmail(e.target.value) }

  const TypographyStyled = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
  }))
  
  const LinkStyled = styled('a')(({ theme }) => ({
  display: 'flex',
  fontSize: '0.875rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
  }))

  const onSubmitClick = async (e) => {
    e.preventDefault();
    if (email) {
      // const user = await db.collection("email").doc(email).get()
      let result = ""
      // if (user.exists) {
        // result = await resetPassword(email)
        try{
          await auth.sendPasswordResetEmail(email);
        }catch(e){
          result = e.message
        }
        setIsSendEmail(true)
        if(result==="There is no user record corresponding to this identifier. The user may have been deleted."){
          setIsSendEmail(false)
          setError("등록되지 않은 이메일입니다.")
        }
      // } else {
      //   setError("등록되지 않은 이메일입니다.")
      // }
    } else {
      setError("이메일을 입력해주세요.")
    }
  }

  return (
    <div className={styles.main_container}>
      <Box sx={{ mb: 4 }}>
        <TypographyStyled variant='h5'>Forgot Password? 🔒</TypographyStyled>
        <Typography variant='body2'>
          Enter your email and we&prime;ll send you instructions to reset your password
        </Typography>
      </Box>
      <form noValidate autoComplete='off' onSubmit={onSubmitClick} style={{ width: "100%" }}>
        {isSendEmail && <p className={styles.success_text}>비밀번호 재설정 이메일을 보냈습니다.<br /> 메일함을 확인해주세요.</p>}
        <TextField
          fullWidth
          id="outlined-helperText"
          label="이메일"
          value={email}
          helperText={isSendEmail ? "": (error === " " ? "계정의 이메일을 작성해주세요. 해당 이메일로 비밀번호 재설정 메일이 전송됩니다." : error) }
          error={error!==" "}
          size="small"
          onChange={onEmailChange}
          style={{ width: "100%" }}
          sx={{mb:3}}
        />
        
        <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 4 }}>
          Send reset link
        </Button>
        <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Link passHref href='/'>
            <LinkStyled>
              <ChevronLeft />
              <span>Back to login</span>
            </LinkStyled>
          </Link>
        </Typography>
      </form>
    </div>
  )
}
export default ForgotPassword