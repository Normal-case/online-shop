import React, { useState, useEffect} from 'react'
import styles from '../../styles/component/ProductStatus.module.css'
import API from '../../api-server'
import Link from 'next/link'

export default function ProductStatus() {

    const [orderArr, setOrderArr] = useState([])

    useEffect(() => {
        API.getOrderList('paied')
            .then(res => {
                if(res.data.success) {
                    console.log(res.data.order)
                    setOrderArr(res.data.order)
                }
            })
            .catch(console.log)
    }, [])
    return (
        <div>
            {
                orderArr.map((order, idx) => {
                    return (
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.productDetail}>
                                    {order.createAt.split('T')[0]} | <Link href={`/order/done/${order._id}`}><span>주문상세보기</span></Link>
                                </div>
                                <div className={styles.productPrice}>
                                    총 주문금액: <span>{order.totalPrice}</span>원
                                </div>
                            </div>
                            <div className={styles.title}>
                                거래완료
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
                })
            }
        </div>
    )
}