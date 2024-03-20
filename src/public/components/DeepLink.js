

import { Button } from "@mui/material"
import styles from "./DeepLink.module.css"
import { styled } from "@mui/material"
import { purple } from "@mui/material/colors"
import { DEEPLINK } from "src/public/functions/handleDeepLinkClick"


const DeepLink = ({url}) => {


  const LinkButton = styled(Button)(({theme}) => ({
    backgroundColor: purple[700],
    padding: "7px 10px",
    '&:hover': {
      backgroundColor: purple[700]
    }
  }))

  const onButtonClick = () => {
    // DEEPLINK.push(`exp://172.30.1.11:19000/--/post/miraero/YUROmFV3sOatJeHloYt9/program`,
    DEEPLINK.push(url,
    "https://play.google.com/store/apps/details?id=com.zzsoft.thehanda",
    "https://apps.apple.com/kr/app/%EB%8D%94%ED%95%9C%EB%8B%A4/id1665555435")
  }

  return(
    <div className={styles.main}>
      <p>아래 버튼을 클릭해 더한다 앱에서 모든 콘텐츠를 확인해보세요.</p>
      <LinkButton
        variant="contained"
        fullWidth
        onClick={onButtonClick}
      >
        더한다 앱에서 콘텐츠에 참여하세요.
      </LinkButton>
    
    </div>
  )
}

export default DeepLink