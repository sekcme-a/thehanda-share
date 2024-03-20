
import "src/public/styles/reset.css"
import styles from "src/public/styles/app.module.css"

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


export default function App({ Component, pageProps }) {

  return (
      <div className={styles.main_container}>
        <div className={styles.content_container}>
          <Component {...pageProps} />
        </div>
      </div>
    )
}
