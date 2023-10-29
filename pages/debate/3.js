
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
      <div className={styles.next_container} onClick={() => router.push("/debate/4")}>
        <h2>{`다음으로 >`}</h2>
      </div>

      <div className={styles.img_container}>
        <img src="/images/debate/person/yi.png" alt="사진"/>
      </div>
      <div className={styles.talk_container}>
        <h1>이정연 수원여성인력개발센터 취업지원팀 주임</h1>
        <h3>
          <TypewriterComponent

            onInit={(typewriter) => {
              typewriter
              .pauseFor(300)
              .typeString(`<span style="margin: 20px"/>수원여성인력개발센터는 고용노동부와 여성가족부에서 지정 받아 경력 단절여성 및 결혼이민여성을 대상으로 구인, 구직 상담 및 취업지원, 직업훈련, 사후관리 사업 등 원스톱 취업지원서비스를 운영하는 일자리 기관입니다. 또 결혼이민여성을 대상으로 고용노동부 국비 취업대비 직무 소양교육 WiCi 프로그램을 운영하고 있습니다.`)
              .pauseFor(300)
              .typeString(`<br/><br/><span style="margin: 20px"/>다문화만을 대상으로 하는 프로그램은 2014년 중국어지도사, 수납전문가 2개 과정, 2015년부터 2017년까지 다문화 요리체험강사 과정, 2019년부터 2021년까지 수원시지원사업 및 여성가족부 국비직업훈련 과정으로 다문화 네일아티스트, 다문화소잉 2개 과정이 있었습니다. 이후 코로나로 인한 모집 및 대면교육의 어려움으로 올해까지는 다문화 여성 대상교육은 중단이 된 상태입니다.`)
              .pauseFor(300)
              .typeString(`<br/><br/><span style="margin: 20px"/>다문화 대상 교육 프로그램 운영이 어려운 점은 ▲모집의 어려움 ▲운영의 어려움 ▲취업지원의 어려움이 있습니다. 모집의 경우 교육과정 홍보 범위가 워크넷 구직 등록자 대상으로 문자가 발송됩니다. 또 전단 및 홈페이지에 관련 정보를 게시하나 정보를 접근하는 대상이 한정적이라는 단점이 있습니다. 또한 유관기관 홍보 요청 등으로 프로그램 과정 홍보 한계에 어려움이 있습니다. 운영의 경우 국비교육과정은 일 4시간 160 시간 이상의 교육시수 등 장기교육 여건으로, 다문화 대상자들이 교육 시간에 대한 부담을 갖고 있다는 점이 있습니다. 특히 교육시간이 일 4시간으로 운영되는데 대상자들이 양육 등의 문제로 지각, 결석, 조퇴 등 출결 관리가 어려워 출석률이 좋지 않은 편입니다. 취업지원의 경우 취업 수요처가 많지 않다는 어려움이 있습니다. 실무교육 수료와 채용 시 기업체 지원 사업 등에 대한 안내 등을 통해 지속적으로 수요처를 발굴하고 있으나, 직종의 특성상 소규모 사업장이 많아 수요처가 적을뿐더러 다문화 대상자의 언어소통 문제나 선입견, 가족의 부당한 간섭 등으로 인한 어려움이 있습니다.`)
              .pauseFor(300)
              .typeString(`<br/><br/><span style="margin: 20px"/>기관 운영시간과 프로그램 운영시간의 경우 모든 대상자에 맞춰 기관을 운영하는 것에는 한계가 있으며, 특정 국가만을 대상으로 하는 프로그램 운영은 없다보니 프로그램 운영에 현실적인 언어적 어려움이 있을 수 밖에 없습니다.`)
              .pauseFor(300)
              .typeString(`<br/><br/><span style="margin: 20px"/>취업기관 현장 실무자로서 취업지원에 대한 의견을 드리면 첫째, 단계별 취업대비 직무 소양 교육이 필요하다고 생각합니다. 현재 기관에서 운영하고 있는 프로그램은 고용노동부 결혼이민여성 취업지원 프로그램(Women Immigrant’s Career Identity) 한 종류입니다. 교육 내용은 직업심리검사 등을 통한 자기탐색, 희망직업탐색 및 실천계획수립, 이력서작성 및 면접기술 등 구직기술 부분 등 내용으로 구성되어 있습니다. 대상 특성상 동영상 등 시청각 자료가 많기는 하나 취업대비 직무소양교육이다 보니 교재 등 교육에서 언급되는 용어 이해의 어려움이 많습니다. 현재는 베트남, 영어 교재만 지원하고 있습니다. 이러한 이유로 참여자의 한국어 수준과 취업희망 직종 등 단계별 차별화된 교육 개발이 필요하다고 생각합니다.`)
              .pauseFor(300)
              .typeString(`<br/><br/><span style="margin: 20px"/>둘째, 동일 국가 여성간의 취업을 주제로 한 커뮤니티 활성화가 필요하다고 생각합니다. 취업 준비 시 취업성공의 가장 큰 요인 중의 하나가 인적 네트워크 형성이라고 생각합니다. 취업을 희망해도 다문화 여성의 경우 취업 지원 서비스나 정보를 어디서 도움을 받을지 모르는 경우가 많아 대부분 같은 국가 출신자에게 가장 많이 도움과 정보를 얻고 있습니다. 커뮤니티를 통해 취업 준비 교육 및 서비스, 채용정보 등 취업 관련 유용한 정보 공유를 통해 필요한 정보를 실시간으로 도움을 받을 수 있을 것이라 생각합니다. 또한 근래 이주한 분들에게는 커뮤니티가 일종의 멘토링 시스템 역할을 함으로 정착에 도움이 될 수 있습니다. 따라서 커뮤니티 활성화를 위해서 동아리 구성 등에 정책적인 지원과 함께 기관과의 연계를 통한 실시간 기관 서비스를 제공하고 또한 기관 프로그램 모집 및 운영에도 도움이 될 수 있습니다.`)
              .pauseFor(300)
              .typeString(`<br/><br/><span style="margin: 20px"/>셋째, 창업 맞춤 교육 및 특강 등 필요합니다. 다문화 여성들이 창업에 대한 관심과 창업준비가 증가하고 있습니다. 스마트스토어, 오픈마켓 온라인 운영 등 비교적 쉽게 창업에 접근할 수 있는 환경적 요인과 출신 국가의 물품 구매대행 희망 등으로 창업에 대한 수요와 관심도가 높아지고 있으며, 이주여성들이 희망직종인 네일아트 과정 등은 취업 연계 보다는 창업으로 이어지는 경우가 많습니다. 이에 취업 교육 외에 창업 교육 개설이 필요하다고 생각합니다.`)
              .pauseFor(300)
              .typeString(`<br/><br/><span style="margin: 20px"/>마지막으로 다문화 여성등을 위한 다양한 공공기관 기간제 일자리 개설 필요합니다. 기간제 일자리를 통해 한국의 직장문화 이해를 돕고 무엇보다 일 경험을 만들어줌으로 단기간의 경력이라도 재취업을 위한 구직 활동시 일경험 커리어가 지원기업에 신뢰도를 줌으로 채용 시 우대 가점사항이 될 수 있습니다.`)
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