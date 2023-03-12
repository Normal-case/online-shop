import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../../component/header'
import Footer from '../../component/footer'
import styles from '../../styles/Option.module.css'
import Grid from '../../component/main/grid'

export default function Option() {
    const router = useRouter()
    const [opt, setOpt] = useState()
    const title = {
        'hot': '인기상품',
        'top': '상의',
        'bottom': '하의',
        'onePiece': '원피스'
    }

    useEffect(() => {
        if(router.isReady) {
            const { option } = router.query
            setOpt(option)
        }
    }, [router])

    return (
        <div>
            <Header />
            <div className={styles.title}>
                {title[opt]}
            </div>
            <div className={styles.body}>     
                <Grid filter={opt} />
            </div>
            <Footer />
        </div>
    )
}