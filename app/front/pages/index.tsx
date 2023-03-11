import React from 'react'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Header from '../component/header'
import Grid from '../component/main/grid'
import Footer from '../component/footer'

export default function Home() {

  return (
    <div className={styles.container}>
      <Header />
      {/* 홈페이지에 노출되는 메인 카드 */}
      <div className={styles.mainCard}>
        <Image src='/img/banner.webp' layout='fill' alt='' objectFit='contain' />
      </div>
      {/* 전체 상품들 그리드 형태로 제공 */}
      <div className={styles.body}>
        <Grid />
      </div>
      <Footer />
    </div>
  )
}
