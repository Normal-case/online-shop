import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { InstagramFilled, TwitterOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

import API from '../api-server'

export default function Header() {
    const router = useRouter()
    const [loginFlag, setLoginFlag] = useState('로그인')

    useEffect(() => {
        API.tokenVerify()
            .then(res => {
                if(res.data.success) {
                    setLoginFlag('로그아웃')
                } else {
                    setLoginFlag('로그인')
                }
            })
            .catch(err => {
                if(err.response) {
                    console.log(err.response.data.msg)
                }
            })
    }, [])

    const loginOrOut = () => {
        if(loginFlag === '로그아웃') {
            API.logout()
                .then(console.log)
                .catch(console.log)
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
                    <Link href="/"><h1>Online Shop</h1></Link>
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