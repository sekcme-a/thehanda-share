import styles from "../styles/pageHeader.module.css"

const PageHeader = ({ title, subtitle, mt}) => {
  return (
    <div className={styles.main_container} style={{marginTop: mt}}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  )
}
export default PageHeader