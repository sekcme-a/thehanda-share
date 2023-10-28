"use client"
import { useState } from 'react'
import Image from 'next/image'
import styles from "src/home/Home.module.css"
import Wrapper from 'src/public/components/Wrapper'
import { useRouter } from 'next/router'


const Home = () => {
  const router = useRouter()
  const [isHover, setIsHover] = useState(false)
  const onHover = () => {
    setIsHover(true)
  }

  return (
    <Wrapper>
      <div className={styles.main_container}>
        <h1 className={styles.text}>인터랙티브 기사</h1>
        <div className={styles.logo}>
          <img src="/images/logo.png" alt="logo"/>
        </div>
        <div className={styles.body_container}>
          <div className={styles.container}>
            <img src="/images/text/title.png" alt="title" className={styles.title} />
            <img
              src="/images/button/earth.png" alt='button'
              className={styles.button}
              onClick={()=>router.push("/text/start")}
            />
          </div>
        </div>
        <div className={styles.person_left_container}>
          <img src="/images/people/001.png" alt="men" />
        </div>
        <div className={styles.person_right_container}>
          <img src="/images/people/003.png" alt="women" />
        </div>
      </div>
    </Wrapper>
  )
}

export default Home