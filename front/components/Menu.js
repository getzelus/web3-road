import styles from "../styles/Menu.module.css";
import Link from 'next/link'

export default function Menu() {
  return (<div className={styles.menu}>

    <Link href='/'>Home</Link>
    <Link href='/tip'>Tip</Link>
    <Link href='/blog'>Blog</Link>

  </div>);
}


