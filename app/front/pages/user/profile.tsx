import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

import { tokenCheck } from '../../module/Token'
import Header from '../../component/header'
import styles from '../../styles/Profile.module.css'
import API from '../../api-server'

export default function Profile() {
    const router = useRouter()
    const [profile, profileSet] = useState()
    const [src, srcSet] = useState('')

    const checkAuth = async () => {
        /* useEffect couldn't use async function */
        const result = await tokenCheck()
        if (!result.success) {
            router.replace('/user/login')
        }
    }
    useEffect(() => {
        checkAuth()
        API.profile()
            .then(res => {
                profileSet(res.data.profile)
                srcSet(res.data.profile.pImage)
            })
            .catch(console.log)
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
                        <div className={styles.profile_card}>
                            <div className={styles.profile_image}>
                                <Image loader={() => src} src={src} width={70} height={70} alt='' />
                            </div>
                            <div className={styles.card_contents}>
                                <p>{profile?.name}님</p>
                                <p>적립포인트: {profile?.point}p</p>
                                <p>보유쿠폰: 0개</p>
                            </div>
                        </div>
                        <div>
                            주소: 
                        </div>
                        <div className={styles.profile_button}>
                            프로필 수정하기
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
