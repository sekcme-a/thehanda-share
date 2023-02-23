import Image from "next/image"
import styles from "src/forgotpassword/styles/index.module.css"

import ForgotPasswordComponent from 'src/forgotpassword/component/ForgotPassword'

import logo_img from "public/logo_2zsoft_no_text.png"
import background_img from "public/admin_forgot_password_background.png"
import tree_img from "public/admin_login_tree.png"



const ForgotPassword = () => {


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
          <Image width="820" height="580" alt="관리자페이지 배경화면" src={background_img} quality={100} />
        </div>
      </div>
      <div className={styles.right_container}>
        <ForgotPasswordComponent admin={true} />
      </div>
    </div>
  )
}

export default ForgotPassword