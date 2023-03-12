import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { InstagramFilled, TwitterOutlined, SettingOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

import API from '../api-server'

export default function Header() {
    const router = useRouter()
    const [loginFlag, setLoginFlag] = useState('로그인')
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        API.tokenVerify()
            .then(res => {
                if(res.data.success) {
                    setLoginFlag('로그아웃')
                    if(res.data.admin) setIsAdmin(true)
                    else setIsAdmin(false)
                } else {
                    setLoginFlag('로그인')
                    if(res.data.admin) setIsAdmin(true)
                    else setIsAdmin(false)
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
                    { isAdmin ? <Link href='/admin'><li><SettingOutlined /></li></Link> : null }
                    <li><Link href="/user/cart"><ShoppingCartOutlined /></Link></li>
                    <li><Link href="/user/profile"><UserOutlined /></Link></li>
                </ul>
                
            </div>
            <ul className={styles.navBar}>
                <Link href={`/list/hot`}><li>인기상품</li></Link>
                <Link href={`/list/top`}><li>상의</li></Link>
                <Link href={`/list/bottom`}><li>하의</li></Link>
                <Link href={`/list/onePiece`}><li>원피스</li></Link>
            </ul>
        </div>
    )
}