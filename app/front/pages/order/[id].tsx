import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Header from '../../component/header'
import styles from '../../styles/Order.module.css'
import API from '../../api-server'

export default function Order() {

    const router = useRouter()
    const [order, setOrder] = useState()
    const [productList, setProductList] = useState([])
    const [totalPayingPrice, setTotalPayingPrice] = useState(0)
    const category = {
        'outer': '아웃터',
        'onePiece': '원피스',
        'knit': '니트',
        'tShirt': '티셔츠',
        'blouse': '블라우스',
        'skirt': '스커트',
        'pants': '팬츠',
    }

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
        var tmpPrice = 0
        for(var i=0;i<data.detail.length;i++) {
            tmpPrice = tmpPrice + data.detail[i].totalPrice
        }
        setTotalPayingPrice(tmpPrice)
    }

    const phone = (e) => {
        console.log(e.target.value)
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
                                <th colSpan={2}>상품정보</th>
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
                                            <td className={styles.imageTd}>
                                                <img src={product.image} width={110} height={110} alt='' />
                                            </td>
                                            <td className={styles.neo}>[{category[product.productCategory]}] {product.productName}</td>
                                            <td className={styles.neo}>{product.price}원</td>
                                            <td className={styles.neo}>{product.amount}개</td>
                                            <td className={styles.bold}>{product.totalPrice}원</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>

                    <div className={styles.title}>
                        배송지 정보
                    </div>

                    <table className={styles.deliveryInfo}>
                        <tbody>
                            <tr>
                                <td className={styles.index}>이름</td>
                                <td><input type='text' className={styles.normal} value={order?.nickname} /></td>
                            </tr>
                            <tr>
                                <td>휴대폰번호</td>
                                <td>
                                    <input type='number' className={styles.phone} value='010' /> - <input type='number' className={styles.phone} /> - <input type='number' className={styles.phone} />
                                </td>
                            </tr>
                            <tr>
                                <td>주소</td>
                                <td>
                                    <div>
                                        <input type='number' className={styles.zoneCode} value={order?.zoneCode} disabled />
                                        <button className={styles.findZoneCode}>우편번호 찾기</button>
                                    </div>
                                    <div>
                                        <input type='text' className={styles.normal} value={order?.address} disabled />
                                        <input type='text' className={styles.normal} value={order?.detail} />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>배송메모</td>
                                <td><input type='text' className={styles.memo} /></td>
                            </tr>
                        </tbody>
                    </table>
                
                    <div className={styles.price}>
                        <span className={styles.totalDes}>총 결제금액:</span> <span className={styles.totalValue}>{totalPayingPrice}원</span>
                    </div>
                    <div className={styles.btnContainer}>
                        <button className={styles.payment}>결제하기</button>
                        <button className={styles.cancel}>취소</button>
                    </div>
                </div>
            </div>
        </div>
    )
}