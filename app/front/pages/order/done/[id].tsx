import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../../../component/header'
import Footer from '../../../component/footer'
import styles from '../../../styles/Order.module.css'
import API from '../../../api-server'

export default function OrderDetail() {

    const router = useRouter()
    const [order, setOrder] = useState()
    const [productList, setProductList] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)

    const category = {
        'outer': '아웃터',
        'onePiece': '원피스',
        'knit': '니트',
        'tShirt': '티셔츠',
        'blouse': '블라우스',
        'skirt': '스커트',
        'pants': '팬츠',
    }

    const orderStatus = {
        'paied': '결제완료',
        'preparing': '상품준비중',
        'depart': '출고시작',
        'shipping': '배송중',
        'delivered': '배송완료'
    }

    useEffect(() => {
        if(router.isReady) {
            const { id } = router.query
            API.getOrder(id)
                .then(res => handleResponse(res.data.data))
                .catch(console.log)
        }
    }, [])

    const handleResponse = (data) => {
        console.log(data.order)
        setOrder(data.order)
        setProductList(data.detail)
        var tmpPrice = 0
        for(var i=0;i<data.detail.length;i++) {
            tmpPrice = tmpPrice + data.detail[i].totalPrice
        }
        setTotalPrice(tmpPrice)
    }

    return (
        <div>
            <Header />
            <div className={styles.body}>
                <div className={styles.orderHeader}>
                    <h1>주문상세확인</h1>
                </div>

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
                                                <img 
                                                    src={product.image}
                                                    width={110}
                                                    height={110}
                                                    alt=''
                                                />
                                            </td>
                                            <td className={styles.neo}>
                                                [{category[product.productCategory]}] {product.productName}
                                            </td>
                                            <td className={styles.neo}>
                                                {product.price}원
                                            </td>
                                            <td className={styles.neo}>
                                                {product.amount}개
                                            </td>
                                            <td className={styles.bold}>
                                                {product.totalPrice}원
                                            </td>
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
                                <td className={styles.index}>
                                    이름
                                </td>
                                <td>
                                    {order?.nickname}
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.index}>
                                    휴대폰번호
                                </td>
                                <td>
                                    {order?.phone}
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.index}>
                                    이메일
                                </td>
                                <td>
                                    {order?.email}
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.index}>
                                    주소
                                </td>
                                <td>
                                    [{order?.zoneCode}] {order?.address} {order?.detail}
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.index}>
                                    배송메모
                                </td>
                                <td>
                                    {order?.memo}
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.index}>
                                    주문상태
                                </td>
                                <td>
                                    {orderStatus[order?.status]}
                                </td>
                            </tr>

                        </tbody>
                    </table>

                    <div className={styles.price}>
                        <span className={styles.totalDes}>총 결제금액:</span>
                        <span className={styles.totalValue}>{totalPrice}원</span>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}