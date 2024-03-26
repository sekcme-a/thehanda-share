import { Button, Grid } from "@mui/material"
import { useEffect, useState } from "react"

import styles from "src/post/[teamId]/[postId]/styles.module.css"

import { firestore as db } from "firebase/firebase"
import { useRouter } from "next/router"

import PostSkeleton from "src/post/[teamId]/[postId]/PostSkeleton"
import { getDate } from "src/public/functions/getDate"

import LanguageIcon from '@mui/icons-material/Language';

import DeepLink from "src/public/components/DeepLink";

const Post = () => {
  const router = useRouter()
  const {teamId, postId} = router.query

  const [data, setData] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const [postType, setPostType] = useState("program")

  useEffect(()=> {

    const fetchData = async () => {
      setIsLoading(true)
      const programDoc = await db.collection("team").doc(teamId).collection("programs").doc(postId).get()
      if(programDoc.exists){
        setData({id: programDoc.id, ...programDoc.data(), quickLink: [...programDoc.data().quickLink]})
        console.log(programDoc.data())
      } else {
        const surveyDoc = await db.collection("team").doc(teamId).collection("surveys").doc(postId).get()
        if (surveyDoc.exists){
          setData({id: surveyDoc.id, ...surveyDoc.data()})
          setPostType("survey")
        }
      }
      setIsLoading(false)
    }

    fetchData()

  },[teamId, postId])



  if(isLoading) return <PostSkeleton />

  if(!data) return (
    <div className={styles.main}>
      <p className={styles.text_no_data}>해당 게시물이 삭제되었거나 존재하지 않습니다.</p>
    </div>
  )
  return(
    <div className={styles.main}>

      <div className={styles.thumbnail}>
        <img alt="thumbnail" src={data.thumbnailURL} />
      </div>

      <div className={styles.mainInfos}>
        <h1>{data.title}</h1>
        {data.subtitle && <h2>{data.subtitle}</h2>}
        {data.endAt &&
          <p className={styles.endAt}>
            {postType==="program" ? "신청마감" : "설문마감"} : {getDate(data?.endAt)}
          </p>
        }

        {data.welcome && <h3>{data.welcome}</h3>}

        {data.mainInfo &&
          <div className={styles.mainInfo}>
            <p>{data.mainInfo}</p>
          </div>
        }
      </div>




      <div className={styles.info_container}>

        {data.info?.map((item, index) => (
          <div key={index} className={styles.info_item}>
            <h4 className={styles.info_title}>
              {item.title}
            </h4>
            <p className={styles.info_content}>
              {item.text}
            </p>
          </div>
        ))}

        {data.quickLink && data.quickLink.length>0 &&
          <div className={styles.info_item}>
            <h4 className={styles.info_title}>바로가기</h4>
            <div style={{width:"100%"}}>
              <Grid container
                sx={{marginTop:"10px"}}
                rowSpacing={2}
                columnSpacing={1}
              >
                {data.quickLink.map((item, index) => {
                  if(item.title !=="" && item.text !==""){
                    return(
                      <Grid item xs={3} key={index}>
                        <div className={styles.website_button}>
                          <a href={item.text} target="_blank" rel="noreferrer">
                            <div className={styles.icon} >
                              <LanguageIcon style={{color:"#7232d9", fontSize:"40px"}}/>
                            </div>
                            <p className={styles.icon_text}>{item.title}</p>
                          </a>
                        </div>
                      </Grid>
                    )
                  }
                  })}
              </Grid>
            </div>
          </div>
        }
      </div>

      <DeepLink url={`com.zzsoft.thehanda://post/${teamId}/${postId}/${postType}`} />
        

    </div>
  )
}

export default Post