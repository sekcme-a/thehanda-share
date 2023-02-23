import styles from "../styles/noAuthority.module.css"
import logo from "public/teams_logo.jpg"
import Image from "next/image"

const NoAuthority = (props) => {
  return (
    <div className={styles.main_container}>
      <div className={styles.no_authority_container}>
        <div className={styles.logo_container}>
          <Image src={logo} alt="Teams 로고" width={350} height={150} />
        </div>  
        <h1>Admin Teams에 오신것을 환영합니다!</h1>
        
        {props.isTeamName ? 
          <>
            <h2>Admin Teams의 {props.teamName} 팀에 대한 엑세스 권한이 없습니다.<br /> 팀의 관리자에게 엑세스 권한을 요청하세요.</h2>
            <h3>요청코드 : {props.uid}</h3>
          </>
        :
          <h2>Admin Teams에 {props.teamName} 조직이 존재하지 않습니다. 조직을 생성하려면 홈페이지 관리자에게 문의하세요.</h2>
      }
      </div>
    </div>
  )
}

export default NoAuthority