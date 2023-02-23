// ** React Imports
import { useState, useEffect } from 'react'

import useData from 'context/data'

import { firestore as db, auth } from 'firebase/firebase'
import { firebaseHooks } from 'firebase/hooks'

import { handleProfileImage } from 'src/public/hooks/handleProfileImage'

import Alert from "src/public/components/Alert"

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(4.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

// const ResetButtonStyled = styled(Button)(({ theme }) => ({
//   marginLeft: theme.spacing(4.5),
//   [theme.breakpoints.down('sm')]: {
//     width: '100%',
//     marginLeft: 0,
//     textAlign: 'center',
//     marginTop: theme.spacing(4)
//   }
// }))

const TabAccount = () => {
  // ** State
  const [openAlert, setOpenAlert] = useState(true)
  const [values, setValues] = useState({
    imgSrc: "",
    name: "",
    position: "없음",
    phoneNumber: "010-xxxx-xxxx",
    imgData:{}
  })
  const [alertControl, setAlertControl] = useState({
    isShow: false,
    mode: "success",
    text: ""
  })

  const onValuesChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const { user, updateUserProfile,userData,  setUserData } = useData()

  useEffect(() => {
    const fetchData = async () => {
      db.collection("user").doc(user.uid).get().then((doc) => {
        setValues({
          ...values,
          name: doc.data().displayName,
          imgSrc: doc.data().photoUrl,
          position: doc.data().position ? doc.data().position : "없음",
          phoneNumber: doc.data().phoneNumber ? doc.data().phoneNumber : "010-xxxx-xxxx"
        })
      })
    }
    fetchData()
  }, [user])

  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setValues({...values, imgSrc: reader.result, imgData: file.target.files[0]})
      reader.readAsDataURL(files[0])
    }
    // console.log(file.target.files[0])
    // setValues({...values, imgSrc: file.target.files[0]})
  }

  const onSubmitClick = async() => {
    try {
      // await firebaseHooks.overWrite("users", user.uid, {
      //   name: values.name,
      //   photo: values.imgSrc,
      //   position: values.position,
      //   phoneNumber: values.phoneNumber
      // })
      let photoUrl=values.imgSrc
      //이미지가 변경됬는지 확인후, 변경되었다면 새로운 이미지 파일 저장.
      if(Object.keys(values.imgData).length!==0)
        photoUrl = await handleProfileImage(values.imgData, `profile/${user.uid}`,1, "base64")
      const data = {
        displayName: values.name,
        photoUrl: photoUrl,
        position: values.position,
        phoneNumber: values.phoneNumber
      }
      await firebaseHooks.overwrite_profile(user.uid, data)
      setUserData({...userData, ...data})
      console.log({...userData, ...data})
      await auth.currentUser.updateProfile({displayName: values.name})
      setAlertControl({ ...alertControl, isShow: true, mode: "success", text: "성공적으로 변경되었습니다!" })
      setTimeout(() => {
        setAlertControl({...alertControl, isShow:false, text: "성공적으로 변경되었습니다!" })
      },2000)
    } catch (e) {
      console.log(e)
      alert(e)
    }
  }

  return (
    <>
      <CardContent>
        <form>
          <Grid container spacing={7}>
            <Grid item xs={12} sx={{ mt: 1.8, mb: 1}}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {console.log(values)}
                <ImgStyled src={values.imgSrc} alt='Profile Pic' />
                <Box>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    프로필 사진 변경
                    <input
                      hidden
                      type='file'
                      onChange={onChange}
                      accept='image/png, image/jpeg'
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>
                  <Typography variant='body2' sx={{ mt: 3}}>
                    PNG혹은 JPEG 형식만 가능합니다.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} sx={{mt:-4}}>
              <TextField fullWidth label='이름'  value={values.name} onChange={onValuesChange("name")} />
            </Grid>
            <Grid item xs={12} sm={6} sx={{mt:-4}}>
              <TextField fullWidth label='직책'  value={values.position} onChange={onValuesChange("position")} />
            </Grid>
            <Grid item xs={12} sm={6} sx={{mt:-4}}>
              <TextField
                fullWidth
                type='email'
                label='전화번호'
                value={values.phoneNumber}
                onChange={onValuesChange("phoneNumber")}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{mt:-4}}>
              <FormControl fullWidth>
                <InputLabel>권한</InputLabel>
                <Select label='Role' defaultValue='admin'>
                  <MenuItem value='admin'>Admin</MenuItem>
                  {/* <MenuItem value='author'>Author</MenuItem>
                  <MenuItem value='editor'>Editor</MenuItem>
                  <MenuItem value='maintainer'>Maintainer</MenuItem>
                  <MenuItem value='subscriber'>Subscriber</MenuItem> */}
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={6} sx={{mt:-4}}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label='Status' defaultValue='active'>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                  <MenuItem value='pending'>Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} sx={{mt:-4}}>
              <TextField fullWidth label='Company' placeholder='ABC Pvt. Ltd.' defaultValue='ABC Pvt. Ltd.' />
            </Grid> */}

            {/* {openAlert ? (
              <Grid item xs={12} sx={{ mb: 3 }}>
                <Alert
                  severity='warning'
                  sx={{ '& a': { fontWeight: 400 } }}
                  action={
                    <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpenAlert(false)}>
                      <Close fontSize='inherit' />
                    </IconButton>
                  }
                >
                  <AlertTitle>Your email is not confirmed. Please check your inbox.</AlertTitle>
                  <Link href='/' onClick={e => e.preventDefault()}>
                    Resend Confirmation
                  </Link>
                </Alert>
              </Grid>
            ) : null} */}

            <Grid item xs={12}>
              <Button variant='contained' sx={{ mr: 3.5 }} onClick={onSubmitClick}>
                변경사항 저장
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Alert control={alertControl} />
    </>
  )
}

export default TabAccount
