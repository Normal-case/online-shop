import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import Header from "../component/header";
import API from "../api-server";
import styles from '../styles/Profile.module.css'

export default function Admin() {

    const router = useRouter()
    const menuData = ['결제완료', '상품준비중', '출고시작', '배송중', '배송완료']
    const [menuIdx, setMenuIdx] = useState(0)
    const orderStatus = {
        'paied': '결제완료',
        'preparing': '상품준비중',
        'depart': '출고시작',
        'shipping': '배송중',
        'delivered': '배송완료'
    }

    useEffect(() => {
        API.tokenVerify()
            .then(res => {
                if(!res.data.admin) {
                    router.replace('/')
                }
            })
    }, [])

    useEffect(() => {
        API.getOrderAllList()
            .then(console.log)
            .catch(console.log)
    }, [])

    const menuActive = (e) => {
        setMenuIdx(e.target.value)
    }

    return (
        <div className={styles.main_container}>
            <Header />
            <div className={styles.main_title}>
                <h1>관리자 페이지</h1>
            </div>
            <div className={styles.profile_layout}>
                <div className={styles.layout_menubar}>
                    <ul>
                        {menuData.map((menu, idx) => {
                            return (
                                <li
                                    value={idx}
                                    key={idx}
                                    onClick={menuActive}
                                    className={idx===menuIdx ? styles.active : ''}
                                >
                                    {menu}
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className={styles.layout_body}>

                </div>
            </div>
        </div>
    )
}