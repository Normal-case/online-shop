import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Header from '../../component/header'
import styles from '../../styles/Order.module.css'
import API from '../../api-server'

export default function Order() {

    const router = useRouter()

    useEffect(() => {
        if(router.isReady) {
            const { id } = router.query
            API.getOrder(id)
                .then(console.log)
                .catch(console.log)
        }
    }, [router])

    return (
        <div>
            <Header />
            <div className={styles.body}>
                {/*  주문서 작성 헤드 */}
                <div className={styles.orderHeader}>
                    <h1>주문서 작성</h1>
                </div>

                {/* 주문서 작성 바디 */}
                <div>

                </div>
            </div>
        </div>
    )
}