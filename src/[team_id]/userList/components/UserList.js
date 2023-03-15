import { useEffect, useState } from "react"
import styles from "../styles/userList.module.css"
import { useRouter } from "next/router"

import { firestore as db } from "firebase/firebase"
import useData from "context/data"
import { firebaseHooks } from "firebase/hooks"

import LoaderGif from "src/public/components/LoaderGif"
import PageHeader from "src/public/components/PageHeader"
import ControlTeamUser from "./ControlTeamUser"
import UserListGrid from "./UserListGrid"

import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import DoneAllIcon from '@mui/icons-material/DoneAll';

const UserList = () => {
  const { teamName, teamId, userList, setUserList, userListCardData, setUserListCardData } = useData()
  const router = useRouter()
  const [cardData, setCardData] = useState([
    { totalUser: 0, title: "loading", avatars:['/default_avatar.png','/default_avatar.png','/default_avatar.png','/default_avatar.png']},
    { totalUser: 0, title: "loading", avatars:['/default_avatar.png','/default_avatar.png','/default_avatar.png','/default_avatar.png']},
    { totalUser: 0, title: "loading", avatars:['/default_avatar.png','/default_avatar.png','/default_avatar.png','/default_avatar.png']},
  ])
  const [listData, setListData] = useState([
    { avatar: '/default_avatar.png', position: "직책", phoneNumber:"010-1243-1243", id: "1", roles:"editor", username:"username", uid: "asdfasdfasdfas" },
  ])
  const [isLoading, setIsLoading] = useState(true)  

  //문자열 길이 자르기
  function cutString(str, num) {
    if (str.length > num) {
      return str.slice(0, num) + "..";
    } else {
      return str;
    }
  }


  const columns = [
  {
    flex: 0.09,
    minWidth: 110,
    field: 'displayName',
    headerName: '닉네임',
    renderCell: ({ row }) => {
      // const { avatar, username }  = row
      return (
        <div className={styles.user_container} onClick={()=>router.push(`/user/${row.uid}`)}>
          <Avatar src={row.photoUrl} sx={{ width: 28, height: 28 }}/>
          <p>{cutString(row.displayName, 6)}</p>
        </div>
      )
    }
  },
  {
    flex: 0.08,
    minWidth: 125,
    headerName: '실명',
    field: 'realName',
      renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ textTransform: 'capitalize' }}>
          {cutString(row.realName,10)}
        </Typography>
      )
    }
  },
  {
    flex: 0.10,
    minWidth:140,
    field: 'phoneNumber',
    headerName: '연락처',
    renderCell: ({ row }) => {
      return (
        <div className={styles.user_container}>
          {row.phoneNumber}
          {console.log(row, row.phoneVerified)}
          {row.phoneVerified===true && 
            <div className={styles.verified}>
            <DoneAllIcon fontSize="24px"/>
            인증됨
            </div>
          }
        </div>
      )
    }
  },

  // {
  //   flex: 0.15,
  //   minWidth: 100,
  //   headerName: '권한',
  //   field: 'roles',
  //   renderCell: ({ row }) => {
  //     return (
  //       <Typography noWrap sx={{ textTransform: 'capitalize' }}>
  //         {row.roles}
  //       </Typography>
  //     )
  //   }
  // },
  ]
  

  useEffect(() => {
    const fetchData = async () => {
      //useData()에 저장된 유저리스트가 없다면 불러오기.
      if(userList.length===0){
        fetchUserList()
      }
      else{
        setListData(userList)
        setCardData(userListCardData)
        setIsLoading(false)
      }
    }
    fetchData()
  },[])


  const fetchUserList = async() => {
    db.collection("team").doc(teamId).collection("users").get().then((query) => {
      let cityAvatars = []
      const promises = query.docs.map((doc,index) => {
        console.log(doc.id)
        return db.collection("user").doc(doc.id).get().then((userDoc) => {
          cityAvatars.push(userDoc.data().photoUrl)
          return {...userDoc.data(), id: index}
        });
      });
      Promise.all(promises).then((result) => {
        setListData(result)
        setCardData([
          { totalUsers: cityAvatars.length, title: `${teamId} 사용자 수`, avatars: cityAvatars },
        ])
        setUserList(result)
        setUserListCardData([{ totalUsers: cityAvatars.length, title: `${teamId} 사용자 수`, avatars: cityAvatars }])
        setIsLoading(false)
      });
    });
  }

  if(isLoading) return <LoaderGif mode="background"/>
  
  return (
    <div>
      <PageHeader title="사용자 현황" subtitle="어플을 사용하는 사용자 현황입니다." mt="20px"/>
      <ControlTeamUser cardData={cardData} />
      <PageHeader title="사용자 목록" subtitle={`${teamId} 사용자 목록입니다, 변경사항은 새로고침 시 표시됩니다.`} mt="40px" />
      <UserListGrid data={listData} columns={columns} />
    </div>
  )
}
export default UserList;