import { useState, useEffect } from "react"

import styles from "../styles/socialLogin.module.css"
import { auth, facebookAuthProvider, firestore, googleAuthProvider, appleAuthProvider, firestore as db } from "firebase/firebase"
import useData from "context/data"

import {
  GoogleLoginButton,
  FacebookLoginButton,
  AppleLoginButton
} from "react-social-login-buttons"


const SocialLogin = (props) => {
  const [text, setText] = useState(props.text)
  const {user, setUser, error, setError} = useData()

  useEffect(() => {
    setText(props.text)
  },[props])



  const loginWithApple = async() => {
    const provider = appleAuthProvider
    try{
      const userCred = await auth.signInWithRedirect(provider)
      setUser(userCred.user ?? null)
    }catch(e){
      setError(e.message)
    }
  }

  const loginWithGoogle = async() => {
    const provider = googleAuthProvider
    try{
      const userCred = await auth.signInWithRedirect(provider)
      setUser(userCred.user ?? null)
    } catch(e){
      setError(e.message)
    }
  }

  const loginWithFacebook = async() => {
    const provider = facebookAuthProvider
    try{
      const userCred = await auth.signInWithRedirect(provider)
      setUser(userCred.user ?? null)
    } catch(e){
      setError(e.message)
    }
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.button_container} >
        <AppleLoginButton onClick={()=>loginWithApple()}><span>애플로 로그인</span></AppleLoginButton>
      </div>
      <div className={styles.button_container2}>
        <GoogleLoginButton onClick={()=>loginWithGoogle()}><span>구글로 로그인</span></GoogleLoginButton>
      </div>
      <div className={styles.button_container3}>
        <FacebookLoginButton onClick={()=>loginWithFacebook()}><span>페이스북으로 로그인</span></FacebookLoginButton>
      </div>
    </div>
  )
}

export default SocialLogin