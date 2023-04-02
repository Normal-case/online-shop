import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../../styles/component/ProductStatus.module.css'
import API from '../../api-server'
import { useRouter } from 'next/router'

export default function ProductStatus({ orderArr, status, idx, setMenuIdx }) {

    const router = useRouter()
    const [cardIdx, setCardIdx] = useState([])
    const [sumIdx, setSumIdx] = useState(0)
    const orderStatus = {
        'paied': '결제완료',
        'preparing': '상품준비중',
        'depart': '출고시작',
        'shipping': '배송중',
        'delivered': '배송완료'
    }

    const nextStatus = {
        'paied': 'preparing',
        'preparing': 'depart',
        'depart': 'shipping',
        'shipping': 'delivered',
    }

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
        // const result = cardIdx.reduce(function add(sum, value) {
        //     return sum + value
        // }, 0)
        var result = 0
        for(var i=0;i<cardIdx.length;i++) {
            if(cardIdx) result = result + 1
        }
        setSumIdx(result)
    }, [cardIdx])

    useEffect(() => {
        if(orderArr) {
            var tmpIdx = []
            for(var i=0;i<orderArr.length;i++) {
                tmpIdx.push(false)
            }
            setCardIdx(tmpIdx)
        }
        setSumIdx(0)
    }, [idx])

    const clickCard = (idx) => {
        var newArr = [...cardIdx]
        newArr[idx] = !cardIdx[idx]
        setCardIdx(newArr)
    }

    const updateStatus = () => {
        if(sumIdx === 0) return
        var updateId = []
        for(var i=0;i<cardIdx.length;i++) {
            if(cardIdx[i]) {
                updateId.push(orderArr[i]._id)
            }
        }
        const body = {
            updateId,
            status: nextStatus[status]
        }
        API.updateOrder(body)
            .then(res => {
                if(res.data.success) {
                    alert('상태가 업데이트 되었습니다.')
                    router.reload()
                }
            })
            .catch(console.log)
    }

    return (
        <div>
            { orderArr?.length !== 0 ?
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
                    <span>해당 데이터가 없습니다.</span>
                </div>
            }
            {
                status !== 'delivered' ?
                <div className={styles.btnContainer}>
                    <button 
                        className={sumIdx===0 ? styles.button : styles.buttonActive}
                        onClick={updateStatus}
                    >
                        {orderStatus[nextStatus[status]]}
                    </button>
                </div> : null
            }

        </div>
    )
}