import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Header from '../../component/header'
import API from '../../api-server'
import styles from '../../styles/Cart.module.css'

export default function Cart() {

    const router = useRouter()

    useEffect(() => {
        API.tokenVerify()
            .then(console.log)
            .catch(err => {
                if(err.response) {
                    router.replace('/user/login')
                }
            })
    }, [])

    return (
        <div>
            <Header />
            <div className={styles.body}>
                <div className={styles.cart_header}>
                    <h1>장바구니</h1>
                    <ul>
                        <li>최근 본 상품</li>
                        <li>장바구니</li>
                        <li>좋아요</li>
                    </ul>
                </div>
                
            </div>
            
        </div>
    )
}