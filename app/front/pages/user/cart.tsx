import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Header from '../../component/header'
import API from '../../api-server'
import styles from '../../styles/Cart.module.css'
import WishListCard from '../../component/wishListCard'
import LikedCard from '../../component/likedCard'

export default function Cart() {

    const router = useRouter()
    const menuData = ['장바구니', '좋아요', '최근 본 상품']
    const [menuIdx, setMenuIdx] = useState(0)
    const [wishList, setWisthList] = useState([])
    const [likedList, setLikedList] = useState([])
    const [selectTotalAmount, setSelectTotalAmount] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        API.cartLikedGet()
            .then(res => handleResponse(res))
            .catch(err => {
                if(err.response) {
                    router.replace('/user/login')
                }
            })
    }, [])

    useEffect(() => {
        setSelectTotalAmount(0)
        setTotalPrice(0)
    }, [menuIdx])

    const handleResponse = (res) => {
        console.log(res.data)
        const data = res.data
        setWisthList(data.wishList)
        setLikedList(data.likedList)
    }

    return (
        <div>
            <Header />
            <div className={styles.body}>
                <div className={styles.cartHeader}>
                    <h1>장바구니</h1>
                    <ul>
                        {menuData.map((menu, idx) => {
                            return (
                                <li
                                    value={idx}
                                    key={idx}
                                    className={idx === menuIdx ? styles.active : ""}
                                    onClick={(e) => setMenuIdx(e.target.value)}
                                >
                                    {menu}
                                </li>
                            )
                        })}
                    </ul>
                </div>
                
                <div>
                    {
                        menuIdx === 0 && wishList.length > 0 ?
                        wishList.map((wish, idx) => {
                            return (
                                <WishListCard 
                                    element={wish} 
                                    selectTotalAmount={selectTotalAmount}
                                    setSelectTotalAmount={setSelectTotalAmount}
                                    totalPrice={totalPrice}
                                    setTotalPrice={setTotalPrice}
                                />
                            )
                        })
                        : menuIdx === 0 && wishList.length <= 0 ?
                        <div className={styles.empty}>
                            <span>등록된 상품이 없습니다.</span>
                        </div>
                        : menuIdx === 1 && likedList.length > 0 ?
                        likedList.map((liked, idx) => {
                            return (
                                <LikedCard
                                    element={liked}
                                    selectTotalAmount={selectTotalAmount}
                                    setSelectTotalAmount={setSelectTotalAmount}
                                    totalPrice={totalPrice}
                                    setTotalPrice={setTotalPrice}
                                />
                            )
                        })
                        : menuIdx === 1 && likedList.length <= 0 ?
                        <div className={styles.empty}>
                            <span>등록된 상품이 없습니다.</span>
                        </div>
                        : 
                        <div className={styles.empty}>
                            <span>등록된 상품이 없습니다.</span>
                        </div>
                    }
                </div>

                {/* 총 금액 계산 */}
                <div className={styles.totalPriceContainer}>
                    <div className={styles.selectAmount}>
                        선택한 상품: {selectTotalAmount}개
                    </div>
                    <div className={styles.totalPrice}>
                        총금액: {totalPrice}원
                    </div>
                </div>
                
                {/* 구매 버튼 */}
                <div className={styles.buttonContainer}>
                    <button className={styles.selectOrder}>선택상품 주문하기</button>
                    <button className={styles.wholeOrder}>전체상품 주문하기</button>
                </div>
            </div>
            
        </div>
    )
}