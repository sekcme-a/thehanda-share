import { AnimatePresence } from "framer-motion"
import "src/public/styles/reset.css"
export default function App({ Component, pageProps }) {

  return (
      <AnimatePresence>
        <Component {...pageProps} />
      </AnimatePresence>
    )
}
