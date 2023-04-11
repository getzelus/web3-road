import '../styles/globals.css'
import Menu from '../components/Menu';

function MyApp({ Component, pageProps }) {
  return (<>
    <Menu />

    <div className='pages-container'>
     <Component {...pageProps} />
    </div>

  </>)
 }

export default MyApp
