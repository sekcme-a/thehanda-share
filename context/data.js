import { createContext, useState, useEffect, useContext } from "react";

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
        setUserListCardData
    }

    return <dataContext.Provider value={value} {...props} />
}