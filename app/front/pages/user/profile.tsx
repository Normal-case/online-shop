import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { deleteCookie } from 'cookies-next'

import { tokenCheck } from '../../module/Token'
import Header from '../../component/header'
import styles from '../../styles/Profile.module.css'

export default function Profile() {
    const router = useRouter()

    const checkAuth = async () => {
        /* useEffect couldn't use async function */
        const result = await tokenCheck()
        if (!result.success) {
            router.replace('/user/login')
        }
    }
    useEffect(() => {
        checkAuth()
    }, [])

    const logout = () => {
        deleteCookie('accesstoken')
        deleteCookie('refreshtoken')
        router.replace('/user/login')
    }

    return (
        <div className={styles.main_container}>
            <Header />
            {/* 프로필 헤더 */}
            <div className={styles.main_title}>
                <h1>마이페이지</h1>
            </div>
            <div className={styles.profile_layout}>
                <div className={styles.layout_menubar}>
                    <ul>
                        <li>내정보</li>
                        <li>결제완료</li>
                        <li>상품준비중</li>
                        <li>출고시작</li>
                        <li>배송중</li>
                    </ul>
                </div>
                <div>
                    <p>아직 정보가 없습니다.</p>
                </div>
            </div>

        </div>
    )
}
