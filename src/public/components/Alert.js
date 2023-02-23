import Alert from '@mui/material/Alert';
import styles from "src/public/styles/alert.module.css"


/**?
 <Alert control={isShow: boolean, mode: "success/error/info/warning", text: "string"} />


   setTimeout(() => {
      setIsShow(false)
    },3000)
    이런식으로 통제
 */
const AlertComponent = ({control}) => {
  return (
      <div className={control.isShow ? styles.alert_container : `${styles.alert_container} ${styles.alert_hide}`}>
      <Alert variant="filled" severity={control.mode === "success" || control.mode === "error" || control.mode === "info" || control.mode === "warning" ? control.mode : "success"} >
        {control.text}
      </Alert>
      </div>
  )
}

export default AlertComponent