import { createContext, useState, useEffect, useContext } from "react";
import { firestore as db } from "firebase/firebase";
import { useRouter } from "next/router";

const dataContext = createContext()

export default function useData(){
    return useContext(dataContext)
}

export function DataProvider(props){
  const router = useRouter()
  const {id} = router.query
    const [teamList, setTeamList] = useState()
    const [team, setTeam]= useState()

    useEffect(()=>{
      if(id) fetch_team(id)
    },[id])

    const fetch_team_list = async() => {
      const list = await db.collection("team").get()
      const list_refined = list.docs.map(doc => ({id: doc.id, ...doc.data()}))
      setTeamList(list_refined)
    }

    const fetch_team = async (id) => {
      const doc = await db.collection("team").doc(id).get()
      if(doc.exists)
        setTeam({
          ...doc.data()
        })
    }


    const value = {
      teamList, setTeamList, fetch_team_list,
      team, setTeam, fetch_team,
    }

    return <dataContext.Provider value={value} {...props} />
}