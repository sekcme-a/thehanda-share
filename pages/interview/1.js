import { useRouter } from "next/router"
import styles from "src/interview/Interview.module.css"
import Wrapper from "src/public/components/Wrapper"
import { motion } from "framer-motion"
import { reverse } from "d3"
import { useEffect, useState } from "react"
import TypewriterComponent from "typewriter-effect"
const FirstInterview = () => {
  const router = useRouter()
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    setTimeout(()=>{
      setIsShow(true)
    },9000 )
  },[])

  return(
    // <Wrapper>
      <div className={styles.main_container}>
        <h1 className={styles.text}>인터랙티브 기사</h1>
        <div className={styles.logo}>
          <img src="/images/logo.png" alt="logo"/>
        </div>
        <div className={styles.prev_container} onClick={() => router.back()}>
          <h2>{`< 이전으로`}</h2>
        </div>
        <div className={styles.body_container}>
          <div className={styles.container}>
            <div style={{position:"relative"}}>
            <motion.img src="/images/airplane.png" alt="비행기" className={styles.plane} initial={{y: -20, x:0}} animate={{y: 20,  rotate: 4}} transition={{ repeat: Infinity, repeatType: "mirror", duration: 2}}/>
              <div className={styles.cloud_container}>
                <img src="/images/cloud.png" alt="구름" className={styles.cloud} />
              </div>
            </div>
            <img src="/images/earth.png" alt="지구"  className={styles.globe}/>
            
          </div>
        </div>
        

        <motion.div className={styles.person_left_container} initial={{opacity: 1, x: -150}} animate={{opacity:1, x:0, transition: {duration: 1, delay: 0}}}>
          <img src="/images/people/002.png" alt="men" />
          
        </motion.div>

        <div className={styles.bottom_container} onClick={() => router.push("/interview/2")}>
          <div style={{position:"relative", height:"100%"}}>
            <TypewriterComponent
              onInit={(typewriter) => {
                typewriter
                .pauseFor(1200)
                .typeString('국적: 타이 Thailand.')
                .pauseFor(500)
                .typeString('<br />[국가정보] 수도 : 방콕 / 인구 약 7,180만 명(세계 20위) / GDP : 4,953억 4,059만(세계 30위) / 면적 : 5,131만 2천ha(세계51위)')
                .pauseFor(500)
                .typeString('<br />한국와의 거리: 약 3,500km (비행시간 약 5시간 30분)')
                .pauseFor(300)
                .typeString('<br /><br />[뱅크]')
                .pauseFor(800)
                .typeString('<br />저는 한국에 가면 타이음식점을 열어 다양한 분들과 친해지고 싶어요.')
                .start()
                .callFunction(function (state) {
                  // state.elements.cursor.style.display = 'none'
                })
                
              }}
              options={{
                delay: 10
              }}
              
            />
            {isShow&& <h3 className={styles.to_next}>대화창을 클릭해서 다음으로 이동하세요.</h3>}
          </div>
        </div>
    </div>
    // </Wrapper>
  )
}

export default FirstInterview