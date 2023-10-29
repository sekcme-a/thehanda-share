
import { useRouter } from "next/router"
import { useState } from "react"
import styles from "src/debate/debate.module.css"
import Talk from "src/public/components/Talk"
import TypewriterComponent from "typewriter-effect"


const TalkOne = () => {
  const router = useRouter()
  const [isTalkEnd, setIsTalkEnd] = useState(false)

  return(
    <div className={styles.main_container}>
      <div className={styles.prev_container} onClick={() => router.back()}>
        <h2>{`< 이전으로`}</h2>
      </div>
      <div className={styles.next_container} onClick={() => router.push("/debate/2")}>
        <h2>{`다음으로 >`}</h2>
      </div>

      <div className={styles.img_container}>
        <img src="/images/debate/person/son.png" alt="사진"/>
      </div>
      <div className={styles.talk_container}>
        <h1>손녕희 경기대다문화교육센터 교육팀장</h1>
        <h3>
          <TypewriterComponent

            onInit={(typewriter) => {
              typewriter
              .pauseFor(300)
              .typeString(`<span style="margin: 20px"/>다문화가족 지원정책은 2010년부터 제1차 기본계획을 시작으로 2023년부터 2027년까지 제4차 기본계획을 갖고 있습니다. 제4차 기본계획의 비전은 다문화가족과 함께 성장하는 조화로운 사회로 다문화가족의 안정적 생활 환경 조성을 목표로 하고 있습니다.`)
              .pauseFor(300)
              .typeString(`<br /><br/><span style="margin: 20px"/>결혼이민자 취업 현황은 주로 단기 아르바이트 또는 시간제 근무, 취업으로 연계되지 않는 다문화 프로그램, 취업 정보 접근의 어려움으로 설명할 수 있습니다. 많은 자격증을 취득했더라도 시간제, 단기 일자리에 머무는 경우가 많았고, 국가에서 진행하거나 지원하는 기관들의 취업 프로그램들은 이주 초기자를 대상으로 하는 기초 소양 교육에 그쳐 현장으로 연계되지 않는 경우가 많았습니다. 또 빠르게 정보를 올리고 취득하고 활용하는 한국 사회의 문화와 달리 정보 접근성이 떨어져 이들의 정보 접근성을 키워야 한다는 점도 주목됩니다.`)
              .pauseFor(300)
              .typeString(`<br /><br/><span style="margin: 20px"/>취업 현황을 살펴보면, ▲가족의 생계유지를 위해 26.0% ▲한국 사회에 적응하기 위해 직업을 구하는 경우가 15.9% ▲미래 준비를 위해 15.4%로 직업을 구하는 이유를 꼽았습니다. 일하면서 어려운 점은 ▲한국어 소통 37.9% ▲자녀 양육 부담 6.6%로 나타났고 임금 수준은 ▲100~150만 원 미만이 22.3% ▲150~200만 원 미만이 25.3%로 100~200만 원 미만에 해당하는 인구가 절반가량인 것으로 나타났습니다.`)
              .pauseFor(300)
              .typeString(`<br /><br/><span style="margin: 20px"/>결혼이민자 취업 환경을 보면, 자녀 양육과 더불어 한국어의 어려움이 구직 과정 어려움으로 연결됐고 이에, 구직을 집 인근 직장으로 한정하는 등의 개인적인 환경 조건이 있습니다. 또 일자리 구직 경로를 보면 주로 선배 이민자들에게 취업 정보를 받는 경우가 많습니다. 따라서 비슷한 환경으로 구직하는 경우가 많은데, 제도적 차원에서 취업지원 정보제공 및 홍보와 지역사회의 일자리 센터, 학원 연계가 필요해 보입니다.`)
              .pauseFor(300)
              .typeString(`<br /><br/><span style="margin: 20px"/>취업 환경 개선 방안으로 본인의 노력과 가족 구성원의 이해와 협조, 프로그램의 개편이 필요합니다. 본인은 한국어 능력 향상과 취업에 도움이 되는 자격증 취득 그리고 직업훈련 등으로 능력을 키워야 하며, 가족들은 이를 이해하고 자녀 양육을 분담하며 협조해야 합니다. 프로그램은 한국어교육에서 나아가 취업 한국어교육으로 의사소통과 직무능력 향상을 위한 높은 수준으로 끌어올린 교육이 필요할 것으로 보이며, 수요자 맞춤형 취업 준비 프로그램 제공과 지역사회 취업 유관기관과 일자리 연계가 필요합니다.`)
              .start()
              .callFunction(function (state) {
                // state.elements.cursor.style.display = 'none'
              })
              
            }}
            options={{
              delay: 3
            }}
          />
        </h3>
      </div>
    </div>
  )
}

export default TalkOne