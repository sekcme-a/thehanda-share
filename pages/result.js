import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styles from "src/result.module.css"


const Result = () => {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [isHide, setIsHide] = useState(true)

  useEffect(() => {
    if(page===1) setIsHide(true)
    else{
      setTimeout(()=> {
        setIsHide(false)
      },3000)
    }
  },[page])

  return(
    <div className={styles.main_container}>
      <div className={styles.phone_container}>
        <div className={styles.sound_container} />
        <div className={styles.on_off_container} />
        <div className={styles.speaker_container}>
          <div className={styles.speaker} />
        </div>
        <div className={styles.content_container}>
          {page===1 ? 
            <div style={{padding: "0 20px"}}>
              <h1 className={styles.title}>메시지</h1>
              <div className={styles.thumbnail} onClick={()=>setPage(2)}>
                <div className={styles.profile}>
                  <img src="/images/people/blank_profile.png" alt="기본 프사" />
                </div>
                <div className={styles.thumbnail_text_container}>
                  <h1>+82 10-1234-5678</h1>
                  <p>{`[서류면접 결과]\n인사팀입니다. 먼저...`}</p>
                </div>    
              </div>
            </div>
          :
            <div>
              <div className={styles.header_container}>
                <div className={styles.back_container} onClick={()=>setPage(1)}>
                  <h1>{`<`}</h1>
                </div>
                <div className={styles.profile_container}>
                  <img src="/images/people/blank_profile.png" alt="기본 프사" />
                  <p>+82 10-1234-5678</p>
                </div>  
              </div>
              <div className={styles.text_container} onClick={()=>router.push('/text/result1')}>
                <h1>문자 메시지</h1>
                <h1>{`(오늘) ${new Date().toLocaleTimeString("ko-kr").slice(0,-3)}`}</h1>
                <div className={styles.text}>
                  {`[서류면접 결과]
인사팀입니다. 먼저 귀한 시간을 쪼개 우리 회사에 지원해주셔서 감사합니다. 정말 아쉽지만 이번에는 저희와 함께하기 어려울 것 같아 연락드렸습니다.

이유1 : 모국에서 경력은 인정되지 않습니다. 한국에서 인정하는 경력을 다시 취득하시길 바랍니다.

이유2 : 커피 바리스타는 저희 회사 업무와 맞지 않습니다. 개인 카페 창업 등에 활용하시길 바랍니다.

이유3 : 컴퓨터 기초는 필수입니다. 더 다양한 컴퓨터 활용 능력 자격증을 우대합니다.

이유4 : 이중언어강사는 저희 같은 통역이나 번역, 수출 및 무역 등을 하지 않는 소규모 민간기업에는 해당 사항이 없어 우대해드리기가 어렵습니다.
                  `}
                </div>  
                {!isHide && <p className={styles.info}>메시지를 클릭해 다음으로 이동해주세요.</p>}
              </div>  
            </div>
        
          }
        </div>
      </div>
     
    </div>
  )
}

export default Result