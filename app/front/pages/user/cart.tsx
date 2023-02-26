import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Header from '../../component/header'
import API from '../../api-server'
import styles from '../../styles/Cart.module.css'
import WishListCard from '../../component/wishListCard'
import LikedCard from '../../component/likedCard'
import { CheckCircleOutlined, CheckCircleFilled } from '@ant-design/icons'

export default function Cart() {

    const router = useRouter()
    const menuData = ['장바구니', '좋아요', '최근 본 상품']
    const [menuIdx, setMenuIdx] = useState(0)
    const [wishList, setWisthList] = useState([])
    const [likedList, setLikedList] = useState([])

    useEffect(() => {
        API.cartLikedGet()
            .then(res => handleResponse(res))
            .catch(err => {
                if(err.response) {
                    router.replace('/user/login')
                }
            })
    }, [])

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
                        menuIdx === 0 ?
                        wishList.map((wish, idx) => {
                            return (
                                <WishListCard element={wish} />
                            )
                        })
                        : menuIdx === 1 ?
                        likedList.map((liked, idx) => {
                            return (
                                <LikedCard element={liked} />
                            )
                        })
                        : null
                    }
                </div>

                <div className={styles.buttonContainer}>
                    <button className={styles.selectOrder}>선택상품 주문하기</button>
                    <button className={styles.wholeOrder}>전체상품 주문하기</button>
                </div>
            </div>
            
        </div>
    )
}