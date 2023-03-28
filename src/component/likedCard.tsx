import React, { useState, useEffect } from 'react'

import API from '../api-server'
import styles from '../styles/Cart.module.css'
import { CheckCircleOutlined, CheckCircleFilled } from '@ant-design/icons'

export default function LikedCard(props) {
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

    const checkBox = () => {
        setBoxCheck(!boxCheck)
        props.handleLikedListAmount(amount, props.element.productId, !boxCheck, props.index)
        const price = amount * props.element.productPrice
        if(!boxCheck) {
            props.setSelectTotalAmount(props.selectTotalAmount + amount)
            props.setTotalPrice(props.totalPrice + price)
        } else {
            props.setSelectTotalAmount(props.selectTotalAmount - amount)
            props.setTotalPrice(props.totalPrice - price)
        }
    }

    const plus = () => {
        setAmount(amount + 1)
        props.handleLikedListAmount(amount + 1, props.element.productId, boxCheck, props.index)
        if(boxCheck) {
            props.setSelectTotalAmount(props.selectTotalAmount + 1)
            props.setTotalPrice(props.totalPrice + props.element.productPrice)
        }
    }

    const minus = () => {
        const isAmountOne = amount === 1 ? true : false
        if(!isAmountOne) {
            setAmount(amount - 1)
            props.handleLikedListAmount(amount - 1, props.element.productId, boxCheck, props.index)
            if(boxCheck) {
                props.setSelectTotalAmount(props.selectTotalAmount - 1)
                props.setTotalPrice(props.totalPrice - props.element.productPrice)
            }
        }
    }

    const remove = () => {
        const data = {
            username: props.element.username,
            productId: props.element.productId
        }
        API.likedDelete(data)
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
                        src={props.element.imageURL}
                        width={150} height={200} alt=''
                        className={styles.checkboxImg}
                    />
                </div>
                <div className={styles.productName}>
                    [{category[props.element.productCategory]}] {props.element.productName}
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
                    {props.element.productPrice}원
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