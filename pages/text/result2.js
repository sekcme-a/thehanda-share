import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Wrapper from "src/public/components/Wrapper"

import TypewriterComponent from "typewriter-effect"
import { motion } from "framer-motion"

const IMG_DELAY = 0.3
const Letsgo = () => {
  const router = useRouter()
  const [isHide, setIsHide] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const [isEnd2, setIsEnd2] = useState(false)

  useEffect(()=>{
    setTimeout(()=>{
      setIsHide(false)
    },7000)
  },[])
  return(
      <div>
        <h1 style={{width:"100vw", fontSize: "20px", whiteSpace:"pre-line", textAlign:'center', lineHeight:1.5, fontWeight:"bold", paddingTop: "15px"}}>
          <TypewriterComponent
            onInit={(typewriter) => {
              typewriter
              .pauseFor(300)
              .typeString('권리와 의무를 행하는 한국사회 구성원으로 편입,')
              .pauseFor(300)
              .typeString('경제적 자립에 대한 고민들, ')
              .pauseFor(300)
              .typeString("함께 나누어 봤습니다.")
              .start()
              .callFunction(function (state) {
                setIsEnd(true)
              })
            }}
            options={{
              delay: 30,
            }}
          />
        </h1>
        {isEnd &&
          <h2 style={{width:"100vw", fontSize:"25px", marginTop:"20px", textAlign:"center"}}>
            <TypewriterComponent
              onInit={(typewriter) => {
                typewriter
                .pauseFor(500)
                .typeString('다문화 경제적 자립 프로그램의 현장 연계 현황과 나아갈 방향')
                .start()
                .callFunction(function (state) {
                  setIsEnd2(true)
                })  
              }}
              options={{
                delay: 20,
              }}
            />
          </h2>
        }
        {
          isEnd2 && 
          <>
          <div style={{margin: "20px 120px"}}>
            <div style={{display:"flex"}}>  
              <motion.div style={{display:"flex", flex: "1 1 0", justifyContent:"center", alignItems:"center"}}
                initial={{opacity: 0}} animate={{opacity:1, transition:{duration: 1, delay: 0}}}
              >
                <img src="/images/debate/001.JPG " style={{width:"90%",height:"90%"}} alt="회의"/>
              </motion.div>
              <motion.div style={{display:"flex", flex: "1 1 0", justifyContent:"center", alignItems:"center"}}
                initial={{opacity: 0}} animate={{opacity:1, transition:{duration: 1, delay: IMG_DELAY}}}
              >
                <img src="/images/debate/002.JPG " style={{width:"90%",height:"90%"}} alt="회의"/>
              </motion.div>
              <motion.div style={{display:"flex", flex: "1 1 0", justifyContent:"center", alignItems:"center"}}
                initial={{opacity: 0}} animate={{opacity:1, transition:{duration: 1, delay: IMG_DELAY*2}}}
              >
                <img src="/images/debate/003.JPG " style={{width:"90%",height:"90%"}} alt="회의"/>
              </motion.div>
            </div>
            <div style={{display:"flex"}}>  
              <motion.div style={{display:"flex", flex: "1 1 0", justifyContent:"center", alignItems:"center"}}
                initial={{opacity: 0}} animate={{opacity:1, transition:{duration: 1, delay: IMG_DELAY*3}}}
              >
                <img src="/images/debate/001.JPG " style={{width:"90%",height:"90%"}} alt="회의"/>
              </motion.div>
              <motion.div style={{display:"flex", flex: "1 1 0", justifyContent:"center", alignItems:"center"}}
                initial={{opacity: 0}} animate={{opacity:1, transition:{duration: 1, delay: IMG_DELAY*4}}}
              >
                <img src="/images/debate/002.JPG " style={{width:"90%",height:"90%"}} alt="회의"/>
              </motion.div>
              <motion.div style={{display:"flex", flex: "1 1 0", justifyContent:"center", alignItems:"center"}}
                initial={{opacity: 0}} animate={{opacity:1, transition:{duration: 1, delay: IMG_DELAY*5}}}
              >
                <img src="/images/debate/003.JPG " style={{width:"90%",height:"90%"}} alt="회의"/>
              </motion.div>
            </div>
          </div>

          <motion.div style={{display:"flex", justifyContent:"center"}} initial={{opacity: 0}} animate={{opacity:1, transition:{duration: 1, delay: IMG_DELAY*6}}}>
            <div style={{padding: "12px 30px", backgroundColor:"purple", color:"white", borderRadius: 10, cursor:"pointer", fontWeight:"bold"}} onClick={()=>router.push("/debate/1")}>
              보러가기  
            </div>
          </motion.div>
          </>
        }
      </div>
  )
}

export default Letsgo