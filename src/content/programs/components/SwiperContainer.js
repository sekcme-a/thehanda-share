import React, { useEffect, useState } from "react"
import { useRouter } from "next/router";

import Link from "next/link";
import Image from "next/image";
import Skeleton from '@mui/material/Skeleton';
import BubbleChartOutlinedIcon from '@mui/icons-material/BubbleChartOutlined';
import Button from '@mui/material/Button';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

import styles from "../styles/swiperContainer.module.css"

import img1 from "public/multicultural-news.png"
import famtaverse from "public/famtaverse.jpg"
import program from "public/program.png"

const MainSwiper = ({ data }) => {
  const [color, setColor] = useState("white")
  const router = useRouter()
  return (
    // <div className={styles.main_container}>
      <div className={styles.swiper_container}>
        <div className={styles.image_container}>
          <Image src={data.backgroundColor} alt="배경" layout="fill" objectFit="cover" objectPosition="center" />
          <div className={styles.blur} />
        </div>
      <div className={styles.overlay}>
        <div className={styles.overlay_container}>
          <div className={styles.content}>
            <h2>{data.groupName}</h2>
            <h3>{data.title}</h3>
            <h4>{data.date}</h4>
          </div>
          <div className={styles.thumbnail_container}>
            <div className={styles.thumbnail_image_container}>
              <Image src={data.thumbnailBackground} alt="배경" layout="fill" objectFit="cover" objectPosition="center" />
              { data.mainThumbnailImg==="" &&
                <div className={color === "white" ? `${styles.thumbnail_overlay} ${styles.white}` : `${styles.thumbnail_overlay} ${styles.black}`} >
                  <h2>{data.groupName}</h2>
                  <h3>{data.title}</h3>
                  <h4>{data.date}</h4>
                </div>
              }
            </div>
          </div>
          <div className={styles.button_container}>
            <Button startIcon={<BubbleChartOutlinedIcon />} className={styles.button}
              style={{ margin: "10px 15px", padding: "8px 0px", width: '150px' }} onClick={()=>router.push(`article/${data.groupId}/${data.id}`)}>
              자세히 보기
            </Button>
            <Button startIcon={<CalendarMonthOutlinedIcon />} className={styles.button}
              style={{ margin: "10px 15px", padding: "5px 0px", width: '150px', color: "#333" }} onClick={() => { router.push(`article/${data.groupId}/${data.id}`); sessionStorage.setItem("schedule", true) }}>
              일정 확인
            </Button>
          </div>
        </div>
        </div>
      </div>
    // </div>
  )
}

export default MainSwiper