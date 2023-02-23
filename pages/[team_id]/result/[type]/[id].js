import { useEffect, useState } from "react";
import { firestore as db } from "firebase/firebase";

import { useRouter } from "next/router"
import styles from "src/[team_id]/index.module.css"
import LoaderGif from "src/public/components/LoaderGif"
import Navbar from "src/public/components/Navbar"
import Header from "src/public/components/Header"
import useData from "context/data";
// import ResultTable from "src/components/admin/ResultTable"
import PageHeader from "src/public/components/PageHeader";
import { CSVDownload, CSVLink } from "react-csv";

import CSVTable from "src/result/components/CSVTable";
import SubContent from "src/public/subcontent/components/SubContent";

import dynamic from 'next/dynamic'
import { Button } from "@mui/material";
// import {CsvToHtmlTable} from "react-csv-to-table"
// const CsvToHtmlTable = dynamic(() => import('react-csv-to-table'), { ssr: false })

const Result = () => {
  const router = useRouter()
  const { team_id, type, id } = router.query
  const { user, userrole, setUserrole, setTeamId,teamName } = useData();

  const [headers, setHeaders] = useState()
  const [data, setData] = useState([])

  const [headers2, setHeaders2] = useState()
  const [data2, setData2] = useState([])

  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const [hasProgramSurvey, setHasProgramSurvey] = useState(false)
  
  useEffect(()=>{
    let columnsList = [ 
      { key: "name", label: "실명"},
      { key: "phone", label: "전화번호"},
    ]
    let columnsList2 = [ 
      { key: "name", label: "실명"},
      { key: "phone", label: "전화번호"},
    ]
    setTeamId(team_id)
    sessionStorage.setItem("teamId", team_id)

    const fetchData = async() => {
      await db.collection("team_admin").doc(team_id).collection("result").doc(id).collection("users").orderBy("createdAt", "desc").get().then((query)=>{
        let rowsList = []
        query.docs.map(async(doc, index)=>{
          const userDoc = await db.collection("user").doc(doc.id).get()
          let tempDataList = {uid: userDoc.id, name: userDoc.data().realName, phone: userDoc.data().phoneNumber}
          
          doc.data().data.map((item, index)=>{
            if (typeof (item.value) === "object") {
              if (item.value.length !== undefined) {
                let tempString = ""
                item.value.map((asdf, index) => {
                  if (index === 0)
                    tempString = asdf
                  else
                    tempString = `${tempString},${asdf}`
                })
                console.log(tempString)
                tempDataList = { ...tempDataList, [item.id]: item.value }
              }
              else
              tempDataList = { ...tempDataList, [item.id]: item.value.toDate().toLocaleString('ko-KR').replace(/\s/g, '') }
            } else
              tempDataList = { ...tempDataList, [item.id]: item.value }

            
            
          })
          rowsList = [...rowsList,tempDataList]
          // rowsList = [...rowsList, tempDataList]
          setData(rowsList)
        })
      })

      await db.collection("team").doc(team_id).collection(type).doc(id).get().then((doc) => {
        setTitle(doc.data().title)
          doc.data().formData.map((item) => {
            columnsList.push({
              label: item.title,
              key: item.id,
            })
          })
        setHeaders(columnsList)
        console.log(columnsList)
      })

      await db.collection("team").doc(team_id).collection("programSurvey").doc(id).get().then(async(doc)=>{
        if(doc.exists){
          setHasProgramSurvey(true)
          await db.collection("team_admin").doc(team_id).collection("programSurveyResult").doc(id).collection("users").get().then((query)=>{
            let rowsList = []
            query.docs.map(async(doc, index)=>{
              const userDoc = await db.collection("user").doc(doc.id).get()
              let tempDataList = {uid: doc.id, name: userDoc.data().realName, phone: userDoc.data().phoneNumber}
              doc.data().data.map((item, index)=>{
                if (typeof (item.value) === "object") {
                  if (item.value.length !== undefined) {
                    let tempString = ""
                    item.value.map((asdf, index) => {
                      if (index === 0)
                        tempString = asdf
                      else
                        tempString = `${tempString},${asdf}`
                    })
                    console.log(tempString)
                    tempDataList = { ...tempDataList, [item.id]: item.value }
                  }
                  else
                  tempDataList = { ...tempDataList, [item.id]: item.value.toDate().toLocaleString('ko-KR').replace(/\s/g, '') }
                } else
                  tempDataList = { ...tempDataList, [item.id]: item.value }
    
                rowsList = [...rowsList,tempDataList]
                console.log(rowsList)
                setData2([...rowsList])
              })
            })
          })
    
          await db.collection("team").doc(team_id).collection("programSurvey").doc(id).get().then((doc) => {
            setTitle(doc.data().title)
              doc.data().formData.map((item) => {
                columnsList2.push({
                  label: item.title,
                  key: item.id,
                })
              })
            setHeaders2(columnsList2)
            console.log(columnsList2)
          })
        }
      })
      
      setIsLoading(false)
    }
    fetchData()

  },[])

  if(isLoading){
    return(
      <></>
    )
  }

  return (
    <div className={styles.main_container}>
    <Header location="result"/>
    <div className={styles.body_container}>
      <Navbar />
      <div className={styles.content_container}>
        <>
        <PageHeader title="폼 결과 확인" subtitle={`"${title}" 폼의 입력 현황입니다.`} mt="40px" />
        {/* <ResultTable /> */}
        {!hasProgramSurvey && type==="programs" && <Button onClick={()=> router.push(`/${team_id}/programSurvey/${id}`)}>프로그램 설문조사 제작</Button>}
        <Button>
          <CSVLink 
            headers={headers} 
            data={data} 
            filename={`${title}.csv`}
            target="_blank"
          >
            엑셀로 추출
          </CSVLink>
        </Button> 
        <div style={{marginTop:"15px"}}/>
        <CSVTable headers={headers} data={data} type={type} docId={id}/>


        <div style={{marginTop:"50px"}} />
        {hasProgramSurvey && 
          <>
            <PageHeader title="프로그램 설문조사 결과 확인" subtitle={`"${title}" 프로그램의 설문조사 결과입니다.`} mt="40px" />
            <Button>
              <CSVLink 
                headers={headers2} 
                data={data2} 
                filename={`${title} 프로그램 설문조사.csv`}
                target="_blank"
              >
                엑셀로 추출
              </CSVLink>
            </Button> 
            <div style={{marginTop:"15px"}}/>
            <CSVTable headers={headers2} data={data2} type="programSurveys" docId={id}/>
          </>
        }
        </>
      </div>
      <div className={styles.sub_content_container}>
        <SubContent />
      </div>
    </div>
  </div>
  )
}

export default Result