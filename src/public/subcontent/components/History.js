import { useState } from "react"



const History = ({data}) => {
  const [isHistoryDetail, setIsHistoryDetail] = useState(false)
  return(
    <>
      {data && 
        <>
          <h1 style={{marginBottom:"5px"}}>기록</h1>
          <div style={{overflowY:"scroll", maxHeight:"300px"}}>
            {data.map((item, index) => {
              if(!isHistoryDetail){
                if(index<10){
                  return(
                    <div key={index} style={{marginTop:"12px"}}>
                      <p style={{fontSize:"12px", marginBottom:"3px"}}>{item.date.toDate().toLocaleString('ko-KR').replace(/\s/g, '').substring(2)}</p>
                      {item.type==="reject" ?
                        <>
                          <p style={{fontSize:"14px", color:"red"}}>{item.text}</p> 
                          <p style={{fontSize:"13px", marginTop:"3px", marginLeft:"15px", fontWeight:"bold"}}>거절사유 : {item.rejectText}</p> 

                        </>
                      :
                        item.type==="apply" ? 
                          <p style={{fontSize:"14px", color:"green"}}>{item.text}</p>  
                        :
                          item.type==="confirm" ? 
                            <p style={{fontSize:"14px", color:"blue", fontWeight:"bold"}}>{item.text}</p>  
                          :
                            <p style={{fontSize:"14px"}}>{item.text}</p>  
                      }
                    </div>
                  )
                }
              } else{
                return(
                  <div key={index} style={{marginTop:"12px"}}>
                  <p style={{fontSize:"12px", marginBottom:"3px"}}>{item.date.toDate().toLocaleString('ko-KR').replace(/\s/g, '').substring(2)}</p>
                  {item.type==="reject" ?
                    <>
                      <p style={{fontSize:"14px", color:"red"}}>{item.text}</p> 
                      <p style={{fontSize:"13px", marginTop:"3px", marginLeft:"15px", fontWeight:"bold"}}>거절사유 : {item.rejectText}</p> 

                    </>
                  :
                    item.type==="apply" ? 
                      <p style={{fontSize:"14px", color:"green"}}>{item.text}</p>  
                    :
                      item.type==="confirm" ? 
                        <p style={{fontSize:"14px", color:"blue", fontWeight:"bold"}}>{item.text}</p>  
                      :
                        <p style={{fontSize:"14px"}}>{item.text}</p>  
                  }
                </div>
                )
              }
            })}
          </div>
        </>
      }
      {isHistoryDetail ? 
        <p style={{fontSize:"13px", marginTop: "10px", textDecoration:"underline", cursor:"pointer"}} onClick={()=>setIsHistoryDetail(false)}>간략히 보기</p>
      :
        data.length>10 && <p style={{fontSize:"13px", marginTop: "10px", textDecoration:"underline", cursor:"pointer"}} onClick={()=>setIsHistoryDetail(true)}>자세히 보기</p>
      }
    </>
  )
}

export default History