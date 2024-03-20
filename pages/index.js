"use client"
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@mui/material'
import { DEEPLINK } from 'src/public/functions/handleDeepLinkClick'


const Home = () => {
  const router = useRouter()
  const [isHover, setIsHover] = useState(false)
  const onHover = () => {
    setIsHover(true)
  }

  // const handleDeepLinkClick = () => {
  //   // DEEPLINK.push(`exp://172.30.1.11:19000/--/post/miraero/YUROmFV3sOatJeHloYt9/program`,
  //   DEEPLINK.push(`com.zzsoft.thehanda://post/miraero/YUROmFV3sOatJeHloYt9/program`,
  //   "https://play.google.com/store/apps/details?id=com.zzsoft.thehanda",
  //   "https://apps.apple.com/kr/app/%EB%8D%94%ED%95%9C%EB%8B%A4/id1665555435")
  // }


  return (
    <div>
\
    </div>
  )
}

export default Home