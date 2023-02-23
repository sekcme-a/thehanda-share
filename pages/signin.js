import Image from "next/image"
import styles from "src/signin/styles/index.module.css"

import SignInAdmin from "src/signin/components/SignInAdmin"


import logo_img from "public/logo_2zsoft_no_text.png"
import background_img from "public/admin_login_background.png"
import tree_img from "public/admin_login_tree.png"



const Signin = () => {


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
        <SignInAdmin />
      </div>
    </div>
  )
}

export default Signin