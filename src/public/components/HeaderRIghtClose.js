import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import styles from "../styles/headerRightClose.module.css"

import { useRouter } from 'next/router';

const HeaderRightClose = ({ title }) => {
  const router = useRouter()

  const onCloseClick = () => {
    router.back()
  }
  return (
    <div className={styles.main_container}>
      <h1>{title}</h1>
      <CloseRoundedIcon className={styles.close_button} style={{ fontSize: "30px" }} onClick={onCloseClick} />
    </div>
  )
}

export default HeaderRightClose