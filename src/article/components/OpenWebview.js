
import styles from "../styles/openWebview.module.css"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const OpenWebview = ({src, open, setOpen}) => {
  return(
    <div className={styles.main_container}>
      <div className={styles.header}>
        <CloseRoundedIcon onClick={()=>setOpen(false)}/>
      </div>
        <div className={styles.iframe_container}>
          <iframe src={src} frameborder="0" ></iframe>
        </div>
    </div>
  )
}

export default OpenWebview