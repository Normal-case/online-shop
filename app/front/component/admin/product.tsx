import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../../styles/component/ProductStatus.module.css'

export default function ProductStatus({ orderArr }) {
    const [cardIdx, setCardIdx] = useState([])
    const [sumIdx, setSumIdx] = useState(0)

    useEffect(() => {
        if(orderArr) {
            var tmpIdx = []
            for(var i=0;i<orderArr.length;i++) {
                tmpIdx.push(false)
            }
            setCardIdx(tmpIdx)
        }
    }, [])

    useEffect(() => {
        const result = cardIdx.reduce(function add(sum, value) {
            return sum + value
        }, 0)
        setSumIdx(result)
    }, [cardIdx])

    const clickCard = (idx: number) => {
        var newArr = [...cardIdx]
        newArr[idx] = !cardIdx[idx]
        setCardIdx(newArr)
    }

    return (
        <div>
            {
                orderArr?.map((order, idx) => {
                    return (
                        <div 
                            onClick={() => clickCard(idx)}
                            className={
                                cardIdx[idx] ? styles.cardActive : styles.adminCard
                            }
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.productDetail}>
                                    {order.createAt.split('T')[0]} | 
                                    주문자: {order.nickname} | &nbsp;
                                    <Link href={`/order/done/${order._id}`}>
                                        <span>주문상세보기</span>
                                    </Link>
                                </div>
                                <div className={styles.productPrice}>
                                    총 주문금액: <span>{order.totalPrice}</span>
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
            <div>
                <button 
                    className={sumIdx===0 ? styles.button : styles.buttonActive}
                >
                    상품준비중
                </button>
            </div>
        </div>
    )
}