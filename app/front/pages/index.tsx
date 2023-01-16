import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { InstagramFilled, TwitterOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

import Header from '../component/header'

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.mainCard}>
        <Image src='/img/banner.webp' layout='fill' alt='' objectFit='contain' />
      </div>
    </div>
  )
}
