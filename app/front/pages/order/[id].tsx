import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import DaumPostcodeEmbed from 'react-daum-postcode'

import Header from '../../component/header'
import styles from '../../styles/Order.module.css'
import API from '../../api-server'

export default function Order() {

    const router = useRouter()
    const [order, setOrder] = useState()
    const [productList, setProductList] = useState([])
    const [totalPayingPrice, setTotalPayingPrice] = useState(0)
    
    // address
    const [modal, setModal] = useState(false)
    const [zoneCode, setZoneCode] = useState()
    const [address, setAddress] = useState()
    const [detail, setDetail] = useState()

    // Info
    const [nickname, setNickname] = useState()
    const [phoneF, setPhoneF] = useState('010')
    const [phoneS, setPhoneS] = useState()
    const [phoneT, setPhoneT] = useState()
    const [email, setEmail] = useState()
    const [memo, setMemo] = useState()

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
        setZoneCode(data.order.zoneCode)
        setAddress(data.order.address)
        setDetail(data.order.detail)
        setProductList(data.detail)
        setNickname(data.order.nickname)
        var tmpPrice = 0
        for(var i=0;i<data.detail.length;i++) {
            tmpPrice = tmpPrice + data.detail[i].totalPrice
        }
        setTotalPayingPrice(tmpPrice)
    }

    const addressInput = () => {
        setModal(true)
    }

    const handleComplete = (data: Object) => {
        setModal(false)
        setAddress(data.address)
        setZoneCode(data.zonecode)
    }

    const nicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value)
    }

    const phoneFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneF(e.target.value)
    }

    const phoneSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneS(e.target.value)
    }

    const phoneTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneT(e.target.value)
    }

    const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const detailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetail(e.target.value)
    }

    const menoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMemo(e.target.value)
    }

    const cancelOrder = () => {
        router.replace('/user/cart')
    }

    const checkForm = () => {
        if(nickname && phoneF && phoneS && phoneT && zoneCode && address && detail) {
            return true
        } else {
            return false
        }
    }

    const doOrder = () => {
        API.getOrder(router.query.id)
            .then(res => {
                if(!res.data.success) {
                    alert('주문 세션이 만료되었습니다.')
                    router.replace('/user/cart')
                }
            })
            .catch(console.log)

        if(!checkForm()) {
            alert('필수 항목을 입력해주세요.')
            return
        }

        if(email) {
            const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            if(!regex.test(email)) {
                alert('올바른 0이메일 형식을 입력해주세요.')
                return
            }
        }
        const body = {
            id: router.query.id,
            nickname,
            phone: phoneF + phoneS + phoneT,
            email,
            zoneCode,
            address,
            detail,
            memo
        }
        API.ordering(body)
            .then(res => {
                if(res.data.success) {
                    alert('주문이 완료되었습니다.')
                    router.replace('/user/profile')
                } else {
                    alert('세션이 만료되었습니다.')
                    router.replace('/user/cart')
                }
            })
            .catch(console.log)
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
                    <div className={styles.desc}>
                        * 항목은 필수로 입력해주시기 바랍니다.
                    </div>

                    <table className={styles.deliveryInfo}>
                        <tbody>
                            <tr>
                                <td className={styles.index}>이름 *</td>
                                <td><input type='text' className={styles.normal} value={nickname} onChange={nicknameChange} /></td>
                            </tr>
                            <tr>
                                <td>휴대폰번호 *</td>
                                <td>
                                    <input 
                                        type='number' 
                                        className={styles.phone} 
                                        value={phoneF} 
                                        onChange={phoneFChange}
                                        maxLength={4}
                                        onInput={(e) => {
                                            if(e.target.value.length > e.target.maxLength)
                                                e.target.value = e.target.value.slice(0, e.target.maxLength)
                                        }}
                                    /> - 
                                    <input 
                                        type='number' 
                                        className={styles.phone} 
                                        onChange={phoneSChange} 
                                        maxLength={4}
                                        onInput={(e) => {
                                            if(e.target.value.length > e.target.maxLength)
                                                e.target.value = e.target.value.slice(0, e.target.maxLength)
                                        }}
                                    /> - 
                                    <input 
                                        type='number' 
                                        className={styles.phone} 
                                        onChange={phoneTChange}
                                        maxLength={4}
                                        onInput={(e) => {
                                            if(e.target.value.length > e.target.maxLength)
                                                e.target.value = e.target.value.slice(0, e.target.maxLength)
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>이메일</td>
                                <td>
                                    <input type='email' className={styles.normal} onChange={emailChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>주소 *</td>
                                <td>
                                    <div>
                                        <input type='number' className={styles.zoneCode} value={zoneCode} disabled />
                                        <button className={styles.findZoneCode} onClick={addressInput}>우편번호 찾기</button>
                                    </div>
                                    <div>
                                        <input type='text' className={styles.normal} value={address} disabled />
                                        <input type='text' className={styles.normal} value={detail} onChange={detailChange} />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>배송메모</td>
                                <td><input type='text' className={styles.memo} onChange={menoChange} /></td>
                            </tr>
                        </tbody>
                    </table>
                
                    <div className={styles.price}>
                        <span className={styles.totalDes}>총 결제금액:</span> <span className={styles.totalValue}>{totalPayingPrice}원</span>
                    </div>
                    <div className={styles.btnContainer}>
                        <button className={styles.payment} onClick={doOrder}>결제하기</button>
                        <button className={styles.cancel} onClick={cancelOrder}>취소</button>
                    </div>
                </div>
            </div>
            {
                modal ?
                <div className={styles.modal}>
                    <div className={styles.openModal}>
                        <div className={styles.modalHeader}>
                            주소를 입력해주세요. <button onClick={() => setModal(false)}>&times;</button>
                        </div>
                        <DaumPostcodeEmbed onComplete={handleComplete} />
                    </div>
                </div> : null
            }
        </div>
    )
}