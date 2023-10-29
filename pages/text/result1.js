import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Wrapper from "src/public/components/Wrapper"

import TypewriterComponent from "typewriter-effect"


const Letsgo = () => {
  const router = useRouter()
  const [isHide, setIsHide] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const [isStartDelete, setIsStartDelete] = useState(false)

  useEffect(()=>{
    setTimeout(()=>{
      setIsHide(false)
    },7000)
  },[])
  return(
    <Wrapper>
      <div style={{width:"100vw", height:"100vh", backgroundColor:"white", display:"flex", flexWrap:"wrap",justifyContent:"center", alignItems:"center", cursor:"pointer"}} onClick={()=>router.push("/text/result2")}>
        <div>
        <h1 style={{width:"100vw", fontSize: "50px", whiteSpace:"pre-line", textAlign:'center', lineHeight:1.5, fontWeight:"bold"}}>
          <TypewriterComponent
            onInit={(typewriter) => {
              typewriter
              .pauseFor(300)
              .typeString('취업과 경제적 자립,')
              .pauseFor(500)
              .typeString('<br/>약 10년 전부터 필요성이 대두되었습니다.')
              .pauseFor(400)
              
              .start()
              .callFunction(function (state) {
                setIsEnd(true)
              })
            }}
            options={{
              delay: 50,
            }}
          />
        </h1>

        {isEnd && 
          <p style={{width:"100vw", fontSize:"12px", textAlign:"center", marginTop:"50px"}}>
            <TypewriterComponent
              onInit={(typewriter) => {
                typewriter
                .pauseFor(200)
                .typeString(`'결혼이민자 가구의 53%가 절대빈곤가구이고, 결혼이민여성의 85.7%가 직장을 원해...' -류보현(2011)`)
                .pauseFor(200)
                .typeString(`<br /><br />'다문화사회로 변화해가고 있는 한국은 결혼이주여성들을 대상으로 취업 정책의 필요성과 이들을 대상으로 진로 개발이 절실히 필요...' -알기르마(2014)`)
                .start()
                .callFunction(function (state) {
                  setIsStartDelete(true)
                })
              }}
              options={{
                delay: 10,
              }}
            />
          </p>
        }
        </div>
        {!isHide && <p style={{position:"absolute", bottom:"50px", width:"100vw", textAlign:"center" }}>아무 곳이나 클릭하세요.</p>}
      </div>
    </Wrapper>
  )
}

export default Letsgo