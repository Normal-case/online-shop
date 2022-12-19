import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { InstagramFilled, TwitterOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>

        <ul className={styles.socialIcon}>
          <li><InstagramFilled /></li>
          <li><TwitterOutlined /></li>
        </ul>

        <div className={styles.mainName}>
          <h1>Online Shop</h1>
        </div>

        <ul className={styles.socialIcon}>
          <li><SearchOutlined /></li>
          <li><ShoppingCartOutlined /></li>
          <li><UserOutlined /></li>
        </ul>
      </div>
      <ul className={styles.navBar}>
        <li>아우터</li>
        <li>원피스</li>
        <li>니트</li>
        <li>티셔츠</li>
        <li>블라우스</li>
        <li>스커트</li>
        <li>팬츠</li>
        <li>언더웨어</li>
      </ul>

      <div className={styles.mainCard}>
        <Image src='/img/banner.webp' layout='fill' alt='' objectFit='contain' />
      </div>
    </div>
  )
}
