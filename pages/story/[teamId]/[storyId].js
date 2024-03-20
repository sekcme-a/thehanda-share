import styles from "src/story/[teamId]/styles.module.css"



import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, Autoplay, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { firestore as db } from "firebase/firebase";
import { dateFromNow, getDate } from "src/public/functions/getDate";
import { DEEPLINK } from "src/public/functions/handleDeepLinkClick";
import DeepLink from "src/public/components/DeepLink";

SwiperCore.use([Navigation, Scrollbar, Autoplay,Pagination]);

const Story = () => {
  const router = useRouter()
  const {teamId, storyId} = router.query
  
  const DEEPLINK_URL = `com.zzsoft.thehanda://story/${teamId}/${storyId}`

  const [data, setData] = useState(null)

  useEffect(()=> {
    const fetchData = async () => {
      const doc = await db.collection("team").doc(teamId).collection("story").doc(storyId).get()
      if(doc.exists && doc.data().condition==="게재중"){
        setData({...doc.data(), id: doc.id})
      }
    }
    fetchData()
  },[teamId, storyId])

  const onButtonClick = () => {
    DEEPLINK.push(DEEPLINK_URL,
    "https://play.google.com/store/apps/details?id=com.zzsoft.thehanda",
    "https://apps.apple.com/kr/app/%EB%8D%94%ED%95%9C%EB%8B%A4/id1665555435")
  }


  return(
    <div className={styles.main}>
      
      {/* <div className="swiper-container"> */}
      <Swiper
        spaceBetween={5} // 슬라이스 사이 간격
        slidesPerView={1} // 보여질 슬라이스 수
        // navigation={true} // prev, next button
        pagination={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false, // 사용자 상호작용시 슬라이더 일시 정지 비활성
        }}
        style={{width:'100%'}}
      >
        {data?.imgs?.map((item, index) => (
          <SwiperSlide key={index}>          
            <img src={item.url} alt="썸네일" className={styles.thumbnail}/>
          </SwiperSlide>
        ))}
      </Swiper>
      
      
      <div className={styles.content}>
        <img src="/heart_off.png" alt="하트" className={styles.like_button} onClick={onButtonClick}/>
        <img src="/comment.png" alt="댓글" className={styles.like_button} onClick={onButtonClick} />

        <h1 className={styles.title}>{data.title}</h1>
        <p className={styles.text}>{data.content}</p>

        <p className={styles.date}>{dateFromNow(data.publishedAt, new Date(), 60)} 전</p>
      </div>

      <DeepLink url={DEEPLINK_URL} />
    </div>
  )
}

export default Story