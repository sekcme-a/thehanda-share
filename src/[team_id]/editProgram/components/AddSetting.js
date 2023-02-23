import styles from "../styles/customForm.module.css"

const AddSetting = (props) => {
  return (
    <div className={styles.add_container} onClick={props.onAddClick}>
      {props.text ? 
        <h2>프로필에서 추가</h2>
      :
        <p>+</p>
      }
    </div>
  )
}
export default AddSetting