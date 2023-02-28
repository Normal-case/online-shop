import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Header from '../../component/header'
import styles from '../../styles/Order.module.css'
import API from '../../api-server'

export default function Order() {

    const router = useRouter()
    const [order, setOrder] = useState()
    const [productList, setProductList] = useState([])

    useEffect(() => {
        if(router.isReady) {
            const { id } = router.query
            API.getOrder(id)
                .then(res => {
                    if(res.data.success) handleResponse(res.data.data)
                    else {
                        alert('주문 세션이 만료되었습니다.')
                        router.replace('/user/cart')
                    }
                })
                .catch(console.log)
        }
    }, [router])

    const handleResponse = (data) => {
        setOrder(data.order)
        setProductList(data.detail)
        console.log(data.detail)
    }

    return (
        <div>
            <Header />
            <div className={styles.body}>
                {/*  주문서 작성 헤드 */}
                <div className={styles.orderHeader}>
                    <h1>주문서 작성</h1>
                </div>

                {/* 주문서 작성 바디 */}
                <div className={styles.orderMain}>
                    <div className={styles.title}>
                        주문상품
                    </div>

                    <table className={styles.orderProductTable}>
                        <thead>
                            <tr>
                                <th>상품정보</th>
                                <th>가격</th>
                                <th>수량</th>
                                <th>총금액</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                productList.map((product, idx) => {
                                    return (
                                        <tr>
                                            <td>{product.productName}</td>
                                            <td>{product.price}</td>
                                            <td>{product.amount}</td>
                                            <td>{product.totalPrice}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    )
}