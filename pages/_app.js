import '../styles/globals.css'
import { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import {Toaster} from 'react-hot-toast'
import {UserContext} from '../lib/context'
import { useUserData } from '../lib/hooks';

export default function App({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
    <Navbar />                     {/*this will put the navbar in every page. we dont have to put it manually */}
    <Component {...pageProps}/> 
    <Toaster/>
    </UserContext.Provider>
    )
}
