import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

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
