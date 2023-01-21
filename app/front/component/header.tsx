import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { InstagramFilled, TwitterOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

import { tokenCheck } from '../module/Token'
import API from '../api-server'

export default function Header() {
    const router = useRouter()
    const [loginFlag, setLoginFlag] = useState('로그인')

    const checkAuth = async () => {
        const result = await tokenCheck()
        if(result.success) setLoginFlag('로그아웃')
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const loginOrOut = () => {
        if(loginFlag === '로그아웃') {
            API.logout()
        }
        router.replace('/user/login')
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerBar}>

                <ul className={styles.socialIcon}>
                    <li><InstagramFilled /></li>
                    <li><TwitterOutlined /></li>
                </ul>

                <div className={styles.mainName}>
                    <h1><Link href="/">Online Shop</Link></h1>
                </div>

                <ul className={styles.functionIcon}>
                    <li><div onClick={loginOrOut}>{loginFlag}</div></li>
                    <li><SearchOutlined /></li>
                    <li><Link href="/user/cart"><ShoppingCartOutlined /></Link></li>
                    <li><Link href="/user/login"><UserOutlined /></Link></li>
                </ul>
                
            </div>
            <ul className={styles.navBar}>
                <li>아우터</li>
                <li>원피스</li>
                <li>니트</li>
                <li>티셔츠</li>
                <li>블라우스</li>
                <li>스커트</li>
                <li>팬츠</li>
                <li>언더웨어</li>
            </ul>
        </div>
    )
}