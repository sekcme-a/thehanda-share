import "src/public/styles/reset.css"
import "src/public/styles/quill.css"
import "src/public/styles/calendar.css"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DataProvider } from "context/data";
import { useEffect } from "react";
import AuthStateChanged from "src/public/hooks/AuthStateChanged";

import { auth } from "firebase/firebase";
import { firestore as db } from "firebase/firebase";

export default function App({ Component, pageProps }) {
  
  const theme = createTheme({
    palette: {
      primary: {
        main: '#814ad8'
      }
    }
  });


  return (
      
        <DataProvider>
          <AuthStateChanged>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
          </AuthStateChanged>
        </DataProvider>
    
    )
}
