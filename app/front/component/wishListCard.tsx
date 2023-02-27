import React, { useState, useEffect } from 'react'

import styles from '../styles/Cart.module.css'
import API from '../api-server'
import { CheckCircleOutlined, CheckCircleFilled } from '@ant-design/icons'

export default function WishListCard({ element }) {
    const [amount, setAmount] = useState(1)
    const [boxCheck, setBoxCheck] = useState(false)
    const [hide, setHide] = useState(false)
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
        if(element.amount) {
            setAmount(element.amount)
        }
    }, [])

    const checkBox = () => {
        setBoxCheck(!boxCheck)
    }

    const plus = () => {
        setAmount(amount + 1)
    }

    const minus = () => {
        const isAmountOne = amount === 1 ? true : false
        if(!isAmountOne) setAmount(amount - 1)
    }

    const remove = () => {
        const data = {
            username: element.username,
            productId: element.productId
        }

        API.wishListDelete(data)
            .then(res => {
                if(res.data.success) {
                    setHide(true)
                }
            })
            .catch(console.log)
    }

    return (
        <>
        { hide ? null :
        <div className={styles.productCard}>
            {/* 체크박스 이미지 상품명 */}
            <div className={styles.cardFront}>
                <div className={boxCheck ? styles.checkBoxActive : styles.checkbox} onClick={checkBox}>
                    { boxCheck ? <CheckCircleFilled /> : <CheckCircleOutlined />}
                </div>
                <div>
                    <img
                        src={element.imageURL}
                        width={150} height={200} alt=''
                        className={styles.checkboxImg}
                    />
                </div>
                <div className={styles.productName}>
                    [{category[element.productCategory]}] {element.productName}
                </div>
            </div>
            {/* 수량 가격 닫기버튼 */}
            <div className={styles.cardBack}>
                <div className={styles.optionsBtn}>
                    <button className={styles.amountBtn} onClick={minus}>-</button>
                    <span>{amount}</span>
                    <button className={styles.amountBtn} onClick={plus}>+</button>
                </div>
                <div className={styles.eachPrice}>
                    {element.productPrice}원
                </div>
                <div className={styles.closeBtn}>
                    <button onClick={remove}>&times;</button>
                </div>
            </div>
        </div>
        }
        </>
    )
}