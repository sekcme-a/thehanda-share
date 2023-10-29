
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
      <div className={styles.next_container} onClick={() => router.push("/credit")}>
        <h2>{`다음으로 >`}</h2>
      </div>

      <div className={styles.img_container}>
        <img src="/images/debate/person/wang.png" alt="사진"/>
      </div>
      <div className={styles.talk_container}>
        <h1>왕진지애 결혼이주민</h1>
        <h3>
          <TypewriterComponent

            onInit={(typewriter) => {
              typewriter
              .pauseFor(300)
              .typeString(`<span style="margin: 20px"/>중국에서 한국인 남편을 만나 결혼하여 한국에 온 지 10년 정도 되었습니다. 제 개인 이력을 바탕으로 말씀드리기에 개인 인지의 국한성이 있으니 참조만 해주시길 부탁드립니다.`)
              .pauseFor(300)
              .typeString(`<br/><br/><span style="margin: 20px"/>우선, 다문화가족의 경우 소득 수준이 높지 않은 경우가 있습니다. 국제 혼인 후 다문화가정의 어려움을 극복하는 과정에 경제력 개선은 큰 도움이 될 것이라 생각합니다. 요즘 모든 분이 취업이 어려운데, 결혼이주민 취업에 신경을 써주시고 애써주시는 모든 분께 감사의 말씀을 드리고 싶습니다.`)
              .pauseFor(300)
              .typeString(`<br/><br/><span style="margin: 20px"/>다문화가족지원센터 등 대한민국 정부에서 지원해주는 센터의 도움을 많이 받고 있습니다. 교육과 더불어 다양한 친구도 사귈 수 있고, 한국 사회 구성원으로서 살아가는 것에 큰 도움이 됩니다. 다만, 취업에 관련한 센터 자체 장기 정착 프로그램은 미비한 실정입니다. 수원시다문화가족지원센터에서도 취업 관련 프로그램을 타 기관과 연계하여 진행하고 있습니다.`)
              .pauseFor(300)
              .typeString(`<br/><br/><span style="margin: 20px"/>현재 수원시새일센터와 같이 진행하는 취업기초소양교육(WI-CI과정)을 예로 들어 말씀드리고 싶습니다. 해당 교육 덕분에 저는 한국에 와서 어떻게 취업해야하는 지 몰랐는데, 체계적으로 코칭을 받고 이력서 작성과 면접, 구인 사이트 이용 등에 대해 알게 되었습니다. 원하는 직장에 대한 필요 능력을 순차적으로 준비할 수 있었고 덕분에 개인 역량이 강화되어 자신감도 많이 생겼습니다. 많은 결혼이주민이 취업 준비 과정에 대해 모르는 경우가 많습니다. 그럴 경우, 제가 말씀드린 취업기초소양교육과 같은 프로그램을 통해 체계적으로 준비하고 일자리 연계 서비스까지 받으면 좋겠습니다.`)
              .pauseFor(300)
              .typeString(`<br/><br/><span style="margin: 20px"/>다양한 취업 프로그램들이 있으나, 프로그램들에 대한 개선방안을 생각해보았습니다. 결혼이주민 생애 주기별 취업 요구 및 사회 발전에 따라 생긴 요구를 분석하고 관련 기관을 연계한 프로그램 진행이면 좋겠습니다. 또 수요에 따른 프로그램 시간 구성이면 더 많은 대상자가 참석할 수 있을 것이라 생각합니다. 또한 일자리에서도 결혼이민자들의 장점을 살린 특화 일자리도 있으면 좋겠습니다.`)
              .pauseFor(300)
              .typeString(`<br/><br/><span style="margin: 20px"/>결혼이주민, 다문화가정을 위해 애 써주시는 모든 분의 노고를 잘 느끼고 있습니다. 상기 희망 사항은 다문화, 지역사회, 나라 모두가 WIN & WIN 할 수 있도록 저희와 모두가 노력해야 한다고 생각합니다. 한국에서 다문화 이주민의 힘이 되어주셔서 진심으로 다시 감사드립니다.`)
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