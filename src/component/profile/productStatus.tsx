import React, { useState, useEffect} from 'react'
import styles from '../../styles/component/ProductStatus.module.css'
import API from '../../api-server'
import Link from 'next/link'

export default function ProductStatus({ orderArr, status }) {
    const orderStatus = {
        'paied': '결제완료',
        'preparing': '상품준비중',
        'depart': '출고시작',
        'shipping': '배송중',
        'delivered': '배송완료'
    }
    return (
        <div>
            { orderArr?.length !== 0 ?
                orderArr?.map((order, idx) => {
                    return (
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.productDetail}>
                                    {order.createAt.split('T')[0]} | &nbsp;
                                    <Link href={`/order/done/${order._id}`}>
                                        <span>주문상세보기</span>
                                    </Link>
                                </div>
                                <div className={styles.productPrice}>
                                    총 주문금액: <span>{order.totalPrice}</span>원
                                </div>
                            </div>
                            <div className={styles.title}>
                                {orderStatus[status]}
                            </div>
                            <div className={styles.imageContainer}>
                                {
                                    order.imageList.map((image, idx) => {
                                        return (
                                            <img 
                                                src={image} 
                                                height={100} 
                                                width={70} 
                                                alt='' 
                                                className={styles.image}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </div>                        
                    )
                }) :
                <div className={styles.empty}>
                    <span>해당 상품이 없습니다.</span>
                </div>
            }
        </div>
    )
}