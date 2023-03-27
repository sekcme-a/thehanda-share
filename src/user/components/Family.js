import { useEffect, useState } from "react"
import { firestore as db } from "firebase/firebase"
import { useRouter } from "next/router"
import { CircularProgress } from "@mui/material"
import styles from "../styles/family.module.css"
import ChildCareIcon from '@mui/icons-material/ChildCare';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

const Family = ({family}) => {
  const [memberList, setMemberList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(()=>{
    const fetchData = () => {
      const temp = family.map(member => {
        return db.collection("user").doc(member.uid).get()
          .then(memberDoc => {
            if (memberDoc.exists) {
              return {
                relation: member.relation,
                uid: member.uid,
                data: memberDoc.data()
              };
            }
          });
      });
    
      Promise.all(temp).then(result => {
        setMemberList(result);
        setIsLoading(false)
      });
    };
    fetchData()
    
  },[])

  const onUserClick = (uid) => {
    router.push(`/user/${uid}`)
  }

  if(isLoading)
    return(<div className={styles.loading_container}><CircularProgress/></div>)

  if(!isLoading && memberList.length===0)
    return(
      <div className={styles.loading_container}>
        <p>등록된 가족 구성원이 없습니다.</p>
      </div>
    )
  
  return(
    <ul className={styles.container}>
      {memberList.map((member, index) => {
        console.log(member)
        return(
          <li key={index} className={styles.member_container} onClick={()=>onUserClick(member.uid)}>
            {member.relation==="me" && <h1><PermIdentityIcon sx={{pr:"5px"}} />본인</h1>}
            {member.relation==="children" && <h1><ChildCareIcon sx={{pr:"5px"}} />자녀</h1>}
            {member.relation==="spouse" && <h1><FavoriteBorderIcon sx={{pr:'5px'}}/>배우자</h1>}
            {member.relation==="parents" && <h1><SupervisedUserCircleIcon sx={{pr:'5px'}}/>부모</h1>}
            <h3>{member.data.realName}</h3>
            <h4>{`(${member.data.displayName})`}</h4>
            <h4>{member.data.phoneNumber}</h4>
          </li>
        )
      })}
    </ul>
  )
}

export default Family