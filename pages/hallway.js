import { useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/router"
import AskTeam from "src/hallway/components/AskTeam"

const Hallway = () => {
    const {user} = useData()
    const router = useRouter()

    useEffect(()=>{
        if(user===null)
            router.push("/")
    },[])

    return(
        <div style={{
            width:"100%",
            height:"100%",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            backgroundColor:"rgba(244,248,250,0.87)"
        }}>
            <AskTeam />
        </div>
    )
}

export default Hallway