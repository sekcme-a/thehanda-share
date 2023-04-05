import { createContext, useState, useEffect, useContext } from "react";
import { firestore as db } from "firebase/firebase";

const dataContext = createContext()

export default function useData(){
    return useContext(dataContext)
}

export function DataProvider(props){
    const [user, setUser] = useState(null) //I'm
    const [userData, setUserData] = useState(null) //user data from db
    const [error, setError] = useState("")
    const [teamName, setTeamName] = useState("") //어드민 팀명
    const [teamId, setTeamId] = useState("") //어드민 팀 id


    const [userList, setUserList] = useState([]) //모든 유저 정보 한번만 불러오게 저장.
    const [userListCardData, setUserListCardData] = useState([])

    //for subcontent
    const [subContent, setSubContent] = useState({type:"index"})

    //team profile
    const [teamProfile, setTeamProfile] = useState("")

    useEffect(()=>{
        const fetchData = async() => {
            if(teamId!==""){
                db.collection("team").doc(teamId).get().then((doc) => {
                    if(doc.exists){
                        setTeamProfile(doc.data().profile)
                        setTeamName(doc.data().teamName)
                    }

                })
            }
        }
        fetchData() 
    },[teamId])

    const value = {
        user,
        userData,
        error,
        teamName,
        teamId,
        setTeamId,
        setTeamName,
        setError,
        setUser,
        setUserData,
        subContent,
        setSubContent,
        userList,
        setUserList,
        userListCardData,
        setUserListCardData,
        teamProfile,
        setTeamProfile
    }

    return <dataContext.Provider value={value} {...props} />
}