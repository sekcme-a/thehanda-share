// ** React Imports
import { useState, useEffect } from 'react'

import useData from 'context/data'

import { firestore as db } from 'firebase/firebase'
import { firebaseHooks } from 'firebase/hooks'

import Alert from "src/public/components/Alert"

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText';

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'


const TabSecurity = () => {
  // ** States
  const [isProviderIdPassword, setIsProviderIdPassword] = useState(false)
  const [values, setValues] = useState({
    newPassword: '',
    currentPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showCurrentPassword: false,
    showConfirmNewPassword: false,
    errorText: '',
    error: false,
  })

  const [alertControl, setAlertControl] = useState({
    isShow: false,
    mode: "success",
    text: ""
  })

  const { user, updatePassword } = useData()

  useEffect(() => {
    console.log(user.uid)
    db.collection("user").doc(user.uid).get().then((doc) => {
      if(doc.data().providerId==="password")
        setIsProviderIdPassword(true)
      else
        setIsProviderIdPassword(false)
    })
  },[])

  // Handle Current Password
  const handleCurrentPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }

  const handleMouseDownCurrentPassword = event => {
    event.preventDefault()
  }

  // Handle New Password
  const handleNewPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleMouseDownNewPassword = event => {
    event.preventDefault()
  }

  // Handle Confirm New Password
  const handleConfirmNewPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const handleMouseDownConfirmNewPassword = event => {
    event.preventDefault()
  }

  const onSubmitClick = async () => {
    try {
      const reauthenticateUserResult = await firebaseHooks.reauthenticate_user(user.email, values.currentPassword)
      if (reauthenticateUserResult==="success") {
        const result = await firebaseHooks.update_password(values.currentPassword, values.newPassword, values.confirmNewPassword)
        if (result === "success") {
          //성공------------
          setValues({ ...values, error: false })
          setAlertControl({...alertControl, isShow: true, mode:"success", text:"성공적으로 변경되었습니다."})
          setTimeout(() => {
            setAlertControl({...alertControl, isShow: false})
          },2000)
          alert("성공적으로 변경되었습니다.")
        }
      } else {
        setValues({...values,errorText: reauthenticateUserResult, error: true})
      }
    } catch (e) {
      console.log(e)
      setValues({ ...values, errorText: e})
    }
  }

  return (
    <form>
      <CardContent sx={{ pb: 0 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={5}>
              {isProviderIdPassword ? 
                <>
                  <Grid item xs={12} sx={{ mt: 2.75 }}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor='account-settings-current-password' error={values.error}>현재 비밀번호</InputLabel>
                      <OutlinedInput
                        label='Current Password'
                        value={values.currentPassword}
                        id='account-settings-current-password'
                        type={values.showCurrentPassword ? 'text' : 'password'}
                        onChange={handleCurrentPasswordChange('currentPassword')}
                        error={values.error}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              aria-label='toggle password visibility'
                              onClick={handleClickShowCurrentPassword}
                              onMouseDown={handleMouseDownCurrentPassword}
                            >
                              {values.showCurrentPassword ? <EyeOutline /> : <EyeOffOutline />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText error={values.error}>
                        {values.error && values.errorText}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sx={{ mt: 0 }}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor='account-settings-new-password' error={values.errorText==="재확인 비밀번호가 틀렸습니다."}>새 비밀번호</InputLabel>
                      <OutlinedInput
                        label='New Password'
                        value={values.newPassword}
                        id='account-settings-new-password'
                        onChange={handleNewPasswordChange('newPassword')}
                        type={values.showNewPassword ? 'text' : 'password'}
                        error={values.errorText==="재확인 비밀번호가 틀렸습니다."}
                        
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={handleClickShowNewPassword}
                              aria-label='toggle password visibility'
                              onMouseDown={handleMouseDownNewPassword}
                            >
                              {values.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText id="component-error-text" error={values.errorText==="재확인 비밀번호가 틀렸습니다."} >{values.errorText}</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sx={{mt: -2}}>
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor='account-settings-confirm-new-password'
                        error={values.errorText === "재확인 비밀번호가 틀렸습니다." ||
                          values.errorText=== "이 작업은 최근 인증이 필요합니다. 이 요청을 다시 시도하기 전에 재 로그인하십시오."}>
                        새 비밀번호 확인
                      </InputLabel>
                      <OutlinedInput
                        label='Confirm New Password'
                        value={values.confirmNewPassword}
                        id='account-settings-confirm-new-password'
                        type={values.showConfirmNewPassword ? 'text' : 'password'}
                        onChange={handleConfirmNewPasswordChange('confirmNewPassword')}
                        error={values.errorText==="재확인 비밀번호가 틀렸습니다."||
                          values.errorText=== "이 작업은 최근 인증이 필요합니다. 이 요청을 다시 시도하기 전에 재 로그인하십시오."}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              aria-label='toggle password visibility'
                              onClick={handleClickShowConfirmNewPassword}
                              onMouseDown={handleMouseDownConfirmNewPassword}
                            >
                              {values.showConfirmNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText id="component-error-text" error={values.errorText==="재확인 비밀번호가 틀렸습니다."||
                        values.errorText === "이 작업은 최근 인증이 필요합니다. 이 요청을 다시 시도하기 전에 재 로그인하십시오."} >
                        {values.errorText}
                      </FormHelperText>
                    </FormControl>
                    </Grid>
                  </>
                :
                  <Grid item xs={12} sx={{mt: 10}} style={{display:"flex", justifyContent:"center"}}>
                    <h1>소셜 로그인에는 필요하지 않은 기능입니다.</h1>
                  </Grid>
              }
            </Grid>
          </Grid>

          <Grid
            item
            sm={6}
            xs={12}
            sx={{ display: 'flex', mt: [7.5, 2.5], alignItems: 'center', justifyContent: 'center' }}
          >
            <img width={183} alt='avatar' height={256} src='/john_pose.png' />
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ mt: 0, mb: 1.75 }} />

      <CardContent>


        {isProviderIdPassword &&
          <Box>
            <Button variant='contained' sx={{ mr: 3.5 }} onClick={onSubmitClick}>
              변경사항 저장
            </Button>
            <Button
              type='reset'
              variant='outlined'
              color='secondary'
              onClick={() => setValues({ ...values, currentPassword: '', newPassword: '', confirmNewPassword: '', errorText: '' })}
            >
              리셋
            </Button>
          </Box>
        }
      </CardContent>
      <Alert control={alertControl} />
    </form>
  )
}

export default TabSecurity
