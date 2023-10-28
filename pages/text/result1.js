import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Wrapper from "src/public/components/Wrapper"

import TypewriterComponent from "typewriter-effect"


const Letsgo = () => {
  const router = useRouter()
  const [isHide, setIsHide] = useState(true)

  useEffect(()=>{
    setTimeout(()=>{
      setIsHide(false)
    },4000)
  },[])
  return(
    <Wrapper>
      <div style={{width:"100vw", height:"100vh", backgroundColor:"white", display:"flex", justifyContent:"center", alignItems:"center", cursor:"pointer"}} onClick={()=>router.push("/result")}>
        <h1 style={{fontSize: "50px", whiteSpace:"pre-line", textAlign:'center', lineHeight:1.5, fontWeight:"bold"}}>
        <TypewriterComponent
          onInit={(typewriter) => {
            typewriter
            .pauseFor(300)
            .typeString('취업과 경제적 자립,')
            .pauseFor(500)
            .typeString('<br/>약 10년 전부터 필요성이 대두되었습니다.')
            .start()
            .callFunction(function (state) {
              // state.elements.cursor.style.display = 'none'
            })
            
          }}
          options={{
            delay: 50
          }}
          
        />
        </h1>
        {!isHide && <p style={{position:"absolute", bottom:"50px", width:"100vw", textAlign:"center" }}>아무 곳이나 클릭하세요.</p>}
      </div>
    </Wrapper>
  )
}

export default Letsgo