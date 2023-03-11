import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import Header from "../component/header";
import Footer from '../component/footer'
import API from "../api-server";
import styles from '../styles/Profile.module.css'
import ProductStatus from "../component/admin/product";

export default function Admin() {

    const router = useRouter()
    const menuData = ['결제완료', '상품준비중', '출고시작', '배송중', '배송완료']
    const [menuIdx, setMenuIdx] = useState(0)
    const [orderList, setOrderList] = useState()
    const orderStatus = {
        'paied': '결제완료',
        'preparing': '상품준비중',
        'depart': '출고시작',
        'shipping': '배송중',
        'delivered': '배송완료'
    }
    const statusIdx = {
        0: 'paied',
        1: 'preparing',
        2: 'depart',
        3: 'shipping',
        4: 'delivered'
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
        API.getOrderAllList('paied')
            .then(res => {
                if(res.data.success) {
                    setOrderList(res.data.order)
                }
            })
            .catch(console.log)
    }, [])

    useEffect(() => {
        API.getOrderAllList(statusIdx[menuIdx])
            .then(res => {
                if(res.data.success) setOrderList(res.data.order)
            })
            .catch(console.log)
    }, [menuIdx])

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
                    <div className={styles.body_contents}>
                        <ProductStatus
                            orderArr={orderList}
                            status={statusIdx[menuIdx]}
                            idx={menuIdx}
                            setMenuIdx={setMenuIdx}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}