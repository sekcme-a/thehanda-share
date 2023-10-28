
import TypewriterComponent from "typewriter-effect"
import styles from "src/interview/Interview.module.css"
import { useState, useEffect } from "react"

const Talk = ({list=[], setIsTalkEnd, pauseFor=300, delay=10, height="17vh"}) => {
  const [isShow, setIsShow] = useState(false)
  const [number, setNumber] = useState(0)

  const show = () => {
    setTimeout(()=>{
      setIsShow(true)
    },5000)
  }
  useEffect(() => {
    show()
  },[])

  const handleClick = () => {
    if(list.length===number+1){
      setIsTalkEnd(true)
    } else setNumber(prevNumber =>(prevNumber+1))
  }


  return(
    <>
      <div className={styles.bottom_container} onClick={() => handleClick()} key={number} style={{height: height}}>
        <div style={{position:"relative", height:"100%", wordBreak:"keep-all"}}>
          <TypewriterComponent
            onInit={(typewriter) => {
              typewriter
              .pauseFor(pauseFor)
              .typeString(list[number])
              .start()
              .callFunction(function (state) {
                // state.elements.cursor.style.display = 'none'
              })
              
            }}
            options={{
              delay: delay
            }}
            
          />
          {isShow&& <h3 className={styles.to_next}>대화창을 클릭해서 다음으로 이동하세요.</h3>}
        </div>
      </div>
    </>
  )
}

export default Talk