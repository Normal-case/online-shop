import React, { useState } from 'react'

import Header from '../../component/header'
import styles from '../../styles/Order.module.css'

export default function Order() {
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