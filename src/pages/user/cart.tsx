import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Header from '../../component/header'
import Footer from '../../component/footer'
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
    const [wishListAmount, setWishListAmount] = useState([])
    const [likedListAmount, setLikedListAmount] = useState([])

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
        var tmpWishList = []
        for(var i=0;i<wishList.length;i++) {
            var newValue = {
                productId: wishList[i].productId,
                amount: wishList[i].amount,
                checkbox: false
            }
            tmpWishList.push(newValue)
        }

        var tmpLikedList = []
        for(var i=0;i<likedList.length;i++) {
            var newElement = {
                productId: likedList[i].productId,
                amount: 1,
                checkbox: false
            }
            tmpLikedList.push(newElement)
        }
        
        setWishListAmount(tmpWishList)
        setLikedListAmount(tmpLikedList)
    }, [menuIdx])

    const handleWishListAmount = (amount: Number, id: string, checkBox: boolean, index: Number) => {
        let newArr = [...wishListAmount]
        newArr[index].amount = amount
        newArr[index].productId = id
        newArr[index].checkbox = checkBox
        setWishListAmount(newArr)
    }

    const handleLikedListAmount = (amount: Number, id: string, checkBox: boolean, index: Number) => {
        let newArr = [...likedListAmount]
        newArr[index].amount = amount
        newArr[index].productId = id
        newArr[index].checkbox = checkBox
        setLikedListAmount(newArr)
    }

    const handleResponse = (res) => {
        console.log(res.data)
        const data = res.data
        setWisthList(data.wishList)
        setLikedList(data.likedList)
        var tmpWishList = []
        for(var i=0;i<data.wishList.length;i++) {
            var newValue = {
                productId: data.wishList[i].productId,
                amount: data.wishList[i].amount,
                checkbox: false
            }
            tmpWishList.push(newValue)
        }

        var tmpLikedList = []
        for(var i=0;i<data.likedList.length;i++) {
            var newElement = {
                productId: data.likedList[i].productId,
                amount: 1,
                checkbox: false
            }
            tmpLikedList.push(newElement)
        }
        
        setWishListAmount(tmpWishList)
        setLikedListAmount(tmpLikedList)
    }

    const selectOrder = () => {
        if(menuIdx === 0) {
            let newArr = [...wishListAmount]
            for(var i=0;i<newArr.length;i++){
                if(!newArr[i].checkbox) {
                    newArr.splice(i, 1)
                    i--
                }
            }
            const order = newArr
            const body = {
                data: order
            }
            
            if(order.length === 0) {
                alert('상품을 선택해주세요.')
                return
            }
            
            API.order(body)
                .then(res => {
                    if(res.data.success) {
                        router.replace(`/order/${res.data.orderId}`)
                    }
                })
                .catch(console.log)
        } else if(menuIdx === 1) {
            let newArr = [...likedListAmount]
            for(var i=0;i<newArr.length;i++){
                if(!newArr[i].checkbox) {
                    newArr.splice(i, 1)
                    i--
                }
            }
            const order = newArr
            const body = {
                data: order
            }
            if(order.length === 0) {
                alert('상품을 선택해주세요.')
                return
            }
            
            API.order(body)
                .then(res => {
                    if(res.data.success) {
                        router.replace(`/order/${res.data.orderId}`)
                    }
                })
                .catch(console.log)
        }

    }

    const wholeOrder = () => {
        if(menuIdx === 0) {
            // 물품id랑 user는 있으니깐 수량이 중요할듯?
            const body = {
                data: wishListAmount
            }
            API.order(body)
                .then(res => {
                    if(res.data.success) {
                        router.replace(`/order/${res.data.orderId}`)
                    }
                })
                .catch(console.log)
        } else if(menuIdx === 1) {
            const body = {
                data: likedListAmount
            }
            API.order(body)
                .then(res => {
                    if(res.data.success) {
                        router.replace(`/order/${res.data.orderId}`)
                    }
                })
                .catch(console.log)
        }
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
                                    key={idx}
                                    index={idx}
                                    element={wish} 
                                    selectTotalAmount={selectTotalAmount}
                                    setSelectTotalAmount={setSelectTotalAmount}
                                    totalPrice={totalPrice}
                                    setTotalPrice={setTotalPrice}
                                    handleWishListAmount={handleWishListAmount}
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
                                    key={idx}
                                    index={idx}
                                    element={liked}
                                    selectTotalAmount={selectTotalAmount}
                                    setSelectTotalAmount={setSelectTotalAmount}
                                    totalPrice={totalPrice}
                                    setTotalPrice={setTotalPrice}
                                    handleLikedListAmount={handleLikedListAmount}
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
                    <button className={styles.selectOrder} onClick={selectOrder}>선택상품 주문하기</button>
                    <button className={styles.wholeOrder} onClick={wholeOrder}>전체상품 주문하기</button>
                </div>
            </div>
            <Footer />
        </div>
    )
}