import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { InstagramFilled, TwitterOutlined, SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>

        <ul className={styles.socialIcon}>
          <li><InstagramFilled /></li>
          <li><TwitterOutlined /></li>
        </ul>

        <div>
          <h1>Online Shop</h1>
        </div>

        <ul className={styles.socialIcon}>
          <li><SearchOutlined /></li>
          <li><ShoppingCartOutlined /></li>
        </ul>
      </div>
      <div className={styles.navBar}>

      </div>
    </div>
  )
}
