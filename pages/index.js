import { useEffect, useState } from "react"
import Image from "next/image"
import styles from "src/index/styles/index.module.css"
import { useRouter } from "next/router"

import useData from "context/data"

import IdAndPassword from "src/index/components/IdAndPassword"
import SocialLogin from "src/index/components/SocialLogin"

import logo_img from "public/logo_2zsoft_no_text.png"
import background_img from "public/admin_login_background.png"
import tree_img from "public/admin_login_tree.png"


const Index = () => {
  const [text, setText] = useState("")
  const router = useRouter()

  const {user, setUser} = useData()

  useEffect(()=>{
    console.log(user)
    if(user)
      router.push("/hallway")
  },[user])

  
  return (
    <div className={styles.main_container}>
      <div className={styles.left_container}>
        <div className={styles.header_container}>
          <Image width="70" height="45"src={logo_img} alt="이지소프트 로고" />
          <h1>2Z SOFT</h1>
        </div>
        <div className={styles.background_container}>
          <div className={styles.tree_container}>
            <Image width="300" height="220"src={tree_img} alt="나무"/>
          </div>
          <Image width="780" height="620" alt="관리자페이지 배경화면" src={background_img} />
        </div>
      </div>
      <div className={styles.right_container}>
        <h2>Welcome To Admin Team!</h2>
        <h3>로그인을 통해 관리자페이지로 이동하세요.</h3>
        <IdAndPassword />
        <SocialLogin />
      </div>
    </div>
  )
}

export default Index