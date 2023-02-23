import { useEffect, useState } from "react"
import styles from "../styles/manageTeam.module.css"
import { firestore as db } from "firebase/firebase"
import useData from "context/data"
import { firebaseHooks } from "firebase/hooks"

import LoaderGif from "src/public/components/LoaderGif"
import PageHeader from "src/public/components/PageHeader"
import ControlTeamUser from "./ControlTeamUser"
import UserList from "./UserList"
// import UserList from "src/components/admin/content/teamManagement/UserList"

import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

const ManageTeam = () => {
  const { userData, teamId, teamName } = useData()
  const [cardData, setCardData] = useState([
    { totalUser: 0, title: "loading", avatars:['/default_avatar.png','/default_avatar.png','/default_avatar.png','/default_avatar.png']},
    { totalUser: 0, title: "loading", avatars:['/default_avatar.png','/default_avatar.png','/default_avatar.png','/default_avatar.png']},
    { totalUser: 0, title: "loading", avatars:['/default_avatar.png','/default_avatar.png','/default_avatar.png','/default_avatar.png']},
  ])
  const [listData, setListData] = useState([
    { avatar: '/default_avatar.png', position: "직책", phoneNumber:"010-1243-1243", id: "1", roles:"editor", username:"username", uid: "asdfasdfasdfas" },
  ])
  const [isLoading, setIsLoading] = useState(true)  

  
  const columns = [
  {
    flex: 0.09,
    minWidth: 180,
    field: 'fullName',
    headerName: '이름',
    renderCell: ({ row }) => {
      const { avatar, username } = row
      return (
        <div className={styles.user_container}>
          <Avatar src={avatar} />
          <p>{username}</p>
        </div>
      )
    }
  },
  {
    flex: 0.26,
    minWidth: 330,
    field: 'uid',
    headerName: '유저 코드',
    renderCell: ({ row }) => {
      return (
        <Typography variant='body2' noWrap>
          {row.uid}
        </Typography>
      )
    }
  },
  {
    flex: 0.18,
    minWidth:170,
    field: 'phoneNumber',
    headerName: '연락처',
    renderCell: ({ row }) => {
      return (
        <Typography variant='body2' noWrap>
          {row.phoneNumber}
        </Typography>
      )
    }
  },
  // {
  //   flex: 0.8,
  //   minWidth: 100,
  //   headerName: '직책',
  //   field: 'currentPlan',
  //   renderCell: ({ row }) => {
  //     return (
  //       <Typography noWrap sx={{ textTransform: 'capitalize' }}>
  //         {row.position}
  //       </Typography>
  //     )
  //   }
  // },
  {
    flex: 0.15,
    minWidth: 100,
    headerName: '권한',
    field: 'roles',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ textTransform: 'capitalize' }}>
          {row.roles}
        </Typography>
      )
    }
  },
  ]


  useEffect(() => {
    const fetchData = async () => {
      try{
        const uid_list = await firebaseHooks.fetch_admin_uid_list_from_teamId(teamId)
        const users = await firebaseHooks.fetch_user_data_list_from_user_uid_list(uid_list)
        
        let avatars = []
        let userList = []
        let id = 0
        users.forEach((user) => {
          if(user){
          avatars.push(user.photoUrl)
          let role = ""
          userList.push({
            avatar: user.photoUrl,
            position: user.position,
            phoneNumber: user.phoneNumber,
            id: id,
            roles: user.roles[1],
            uid: user.uid,
            username: user.displayName,
          })
          id++
        }
        })
        setCardData([
          { totalUsers: users.length, title: '팀 구성원', avatars: avatars },
        ])
        setListData(userList)
        setIsLoading(false)
      } catch(e){
        console.log(e)
        alert(e)
      }
    }
    fetchData()
  },[])

  if(isLoading) return <LoaderGif mode="background"/>
  
  return (
    <div>
      <PageHeader title="팀 구성원 현황" subtitle="코드를 통해 팀 구성원을 쉽게 관리하세요." mt="20px"/>
      <ControlTeamUser cardData={cardData} />
      <PageHeader title="팀 구성원 목록" subtitle={`${teamName} 팀의 모든 구성원 목록입니다, 변경사항은 새로고침 시 표시됩니다.`} mt="40px" />
      <UserList data={listData} columns={columns} />
    </div>
  )
}
export default ManageTeam;