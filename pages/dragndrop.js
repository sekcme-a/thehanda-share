import styles from "src/dragndrop/Dragndrop.module.css"

import TypewriterComponent from "typewriter-effect"
import { motion } from "framer-motion"

import Draggable, { DraggableData } from 'react-draggable';



import {useState, useRef, useEffect} from "react"
import Certification from "src/dragndrop/Certification";
import Talk from "src/public/components/Talk";
import { useRouter } from "next/router";

const Dragndrop = () => {
  const router = useRouter()
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(0);
  const [folderX, setFolderX] = useState("")
  const [folderY, setFolderY] = useState("")
  const folderRef = useRef()
  const ref = useRef()
  const ref2 = useRef()
  const ref3 = useRef()
  const ref4 = useRef()
  const [isIn, setIsIn] = useState(false)
  const [inList, setInList] = useState([])
  const [talkEnd, setTalkEnd] = useState(false)
  
  // const itemRef1 = useRef()



  useEffect(()=>{
    if (folderRef.current) {
      const element = folderRef.current;
      const rect = element?.getBoundingClientRect();
      const x = rect.left + window.scrollX; // 요소의 왼쪽 가장자리 x 좌표
      const y = rect.top + window.scrollY; // 요소의 상단 가장자리 y 좌표
      setFolderX({min: x, max: x+folderRef.current.offsetWidth})
      setFolderY({min:y, max: y+folderRef.current.offsetHeight})
      console.log(x,x+folderRef.current.offsetWidth)
    }
  },[])
  const handleOnDrag = (data,id) => {
    setIsDragging(id);

      let element = ""
      if(id===1) element = ref.current
      if(id===2) element = ref2.current
      if(id===3) element = ref3.current
      if(id===4) element = ref4.current
      const rect = element?.getBoundingClientRect();
      const x = rect.left + window.scrollX; // 요소의 왼쪽 가장자리 x 좌표
      const y = rect.top + window.scrollY; // 요소의 상단 가장자리 y 좌표

      if(folderX.min<x && folderX.max>x && folderY.min<y && folderY.max>y&&!isIn)
        setIsIn(true)
      else if((folderX.min>x || folderX.max<x || folderY.min>y || folderY.max<y)&&isIn)
        setIsIn(false)
    
  };

  const onStop = () => {
    if(isIn){
      setInList(prevInList => ([
        ...prevInList,
        isDragging
      ]))
      setIsIn(false)
    }
    setIsDragging(0)
  }

  const onClick = () => {
    if(inList.length!==4) alert("모든 자격증을 담아주세요!")
    else router.push("/text/gotoResult")
  }

  return(
    <div>
      <div className={styles.title}>
        <h1 style={{fontSize: "25px", whiteSpace:"pre-line", textAlign:'center', lineHeight:1.5, fontWeight:"bold", marginTop:"40px", position:'absolute', top: 0, left: 0, textAlign:"center", width:"100%"}}>
          <TypewriterComponent
            onInit={(typewriter) => {
              typewriter
              .pauseFor(300)
              .typeString('이력서에 원하는 것들을 담아보세요.')
              .pauseFor(500)
              .typeString('<br/>한국 내 다문화 유관기관에서 제공되는 프로그램이에요.')
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
      </div>
      <div className={styles.body_container}>
        <div className={styles.left_container}  >
          <div className={styles.folder_container}>
            <div  ref={folderRef}>{isIn ? <img src="/images/folder.png" alt="폴더" /> : <img src="/images/folder_black.png" alt="폴더" />}</div>
            <h1>이력서에 넣을 것들을 여기로 드래그하세요!</h1>
          </div>
        </div>
        <div className={styles.middle_container}>
        <motion.h1 initial={{x: -5}} animate={{x: 5,  rotate: 0}} transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.75}}>
          {`<<<`}
        </motion.h1>
        </div>
        <div className={styles.right_container}>
          <div className={styles.rigth_top_container}>
            {!inList.includes(1) && 
              <Draggable
                onDrag={(_, data) => handleOnDrag(data,1)}
                onStop={onStop}
                
              >
                <div style={{margin:"10px", cursor:"pointer"}} ref={ref}>
                  <Certification title="모국스펙" subtitle="Home country Certification" />
                </div>
              </Draggable>
            }
            
            {!inList.includes(2) && 
              <Draggable
                onDrag={(_, data) => handleOnDrag(data,2)}
                onStop={onStop}
                
              >
                <div style={{margin:"10px", cursor:"pointer"}} ref={ref2}>
                  <Certification title="커피 바리스타 자격증" subtitle="Barista Certification" />
                </div>
              </Draggable>
            }
            
          </div>
          <div className={styles.rigth_top_container}>
          {!inList.includes(3) && 
              <Draggable
                onDrag={(_, data) => handleOnDrag(data,3)}
                onStop={onStop}
                
              >
                <div style={{margin:"10px", cursor:"pointer"}} ref={ref3}>
                  <Certification title="컴퓨터 기초자격증" subtitle="Computer Basic Certification" />
                </div>
              </Draggable>
            }
            {!inList.includes(4) && 
              <Draggable
                onDrag={(_, data) => handleOnDrag(data,4)}
                onStop={onStop}
                
              >
                <div style={{margin:"10px", cursor:"pointer"}} ref={ref4}>
                  <Certification title="이중언어강사 자격증" subtitle="Bilingual Language Instructor Certification" />
                </div>
              </Draggable>
            }
          </div>
        </div>
      </div>

      <div className={styles.button_container} onClick={onClick}>
        <div className={inList.length===4 ? `${styles.button} ${styles.active}` : styles.button}>
          <h1>이력서 제출</h1>  
        </div>
      </div>
      {isDragging===1 &&
        <Talk list={["[모국스펙]<br />4년제 대학교를 졸업하여 학위를 취득했어요. 고향에서 다양한 농사일을 돕고 지역 주민들과 친하게 지내 어딜 가든 인정받았어요."]} 
          setIsTalkEnd={setTalkEnd} pauseFor={50} delay={10}
        />
      }
      {isDragging===2 &&
        <Talk list={["[커피 바리스타 자격증]<br />취업 프로그램으로 무료에요. 커피에 대한 이해와 관련된 실습을 하며 바리스타로써 꿈을 키워볼 수 있어요."]} 
          setIsTalkEnd={setTalkEnd} pauseFor={50} delay={10}
        />
      }
      {isDragging===3 &&
        <Talk list={["[컴퓨터 기초자격증]<br />한글, 워드 등 컴퓨터 기초에 대한 무료 프로그램이에요. 모국에서 컴퓨터를 많이 사용하지 않았어도 걱정하지 마세요. 천천히 알아가며 기초 능력을 습득할 수 있어요!"]} 
          setIsTalkEnd={setTalkEnd} pauseFor={50} delay={10}
        />
      }
      {isDragging===4 &&
        <Talk list={["[이중언어강사 자격증]<br />모국의 언어와 한국어를 구사할 줄 안다면 이중언어강사가 되어 언어를 알려줄 수 있어요."]} 
          setIsTalkEnd={setTalkEnd} pauseFor={50} delay={10}
        />
      }
    </div>
  )
}

export default Dragndrop