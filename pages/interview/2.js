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
    },11000 )
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
        

        <motion.div className={styles.person_right_container} initial={{opacity: 1, x: 150}} animate={{opacity:1, x:0, transition: {duration: 1, delay: 0}}}>
          <img src="/images/people/004.png" alt="women" />
          
        </motion.div>

        <div className={styles.bottom_container} onClick={() => router.push("/text/gotoKorea")}>
          <div style={{position:"relative", height:"100%"}}>
            <TypewriterComponent
              onInit={(typewriter) => {
                typewriter
                .pauseFor(1200)
                .typeString('국적: 몽골 Mongolia.')
                .pauseFor(500)
                .typeString('<br />[국가정보] 수도 : 울란바토르 / 인구 약 344만 명(세계 132위) / GDP : 168억 1,088만(세계 123위) / 면적 : 1억 5,641만 1600ha(세계18위)')
                .pauseFor(500)
                .typeString('<br />한국와의 거리: 약 1,700km (비행시간 약 3시간 30분)')
                .pauseFor(300)
                .typeString('<br /><br />[졸자야]')
                .pauseFor(800)
                .typeString('<br />저는 한국에 가면 제가 몽골에서 배웠던 것들을 활용해 취업하고, 결혼하여 행복한 가정을 꾸리고 싶어요.')
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