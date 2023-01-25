import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

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


    return (
        <div className={styles.main_container}>
            <Header />
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
                <div className={styles.layout_body}>
                    <div className={styles.body_contents}>
                        <p>아직 프로필이 없습니다. 프로필 등록을 해주세요</p>
                        <div className={styles.profile_button}>
                            프로필 등록하기
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
