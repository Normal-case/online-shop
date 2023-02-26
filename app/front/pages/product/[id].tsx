import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Header from '../../component/header'
import API from '../../api-server'
import ImageSlider from '../../component/ImageSlider'
import styles from '../../styles/component/ProductDetail.module.css'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import { getCookie } from 'cookies-next'

export default function Product() {
    
    const router = useRouter()
    const [product, setProduct] = useState()
    const [amount, setAmount] = useState(1)
    const [modal, setModal] = useState(false)
    const [heart, setHeart] = useState(false)
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
            API.productDetail(id)
                .then(res => handleResponse(res.data))
                .catch(console.log)
        }
        
    }, [router])

    const handleResponse = (data: Object) => {
        const product = data?.product
        const username = getCookie('user')
        setProduct(product)

        const body = {
            username: username,
            id: product._id
        }

        API.likedGet(body)
            .then(res => {
                const data = res.data
                if(data.success && data.liked) {
                    setHeart(true)
                }
            })
            .catch(console.log)  
    }

    const minus = () => {
        const isAmountOne = amount === 1
        const newAmount = isAmountOne ? 1 : amount - 1
        setAmount(newAmount)
    }

    const plus = () => {
        var tmpAmount = amount + 1
        setAmount(tmpAmount)
    }

    const likedSave = () => {
        API.tokenVerify()
            .then(res => {
                if(res.data.success) {
                    const username = getCookie('user')
                    if(heart) {
                        const data = {
                            username: username,
                            productId: product?._id
                        }
                        API.likedDelete(data)
                            .then(console.log)
                            .catch(console.log)
                        setHeart(false)
                    } else {
                        const body = {
                            username: username,
                            productId: product?._id,
                            productName: product?.name,
                            productPrice: product?.price,
                            productCategory: product?.category,
                            imageURL: product?.image[0]
                        }
                        API.likedPost(body)
                            .then(console.log)
                            .catch(console.log)
                        setHeart(true)
                    }
                }
            })
            .catch(err => {
                if(confirm('로그인 후 찜하기가 가능합니다. 로그인 하시겠습니까?') === true) {
                    router.replace('/user/login')
                }
            })
        
    }

    const cartSave = () => {
        API.tokenVerify()
            .then(res => {
                if(res.data.success) {
                    const username = getCookie('user')
                    const body = {
                        username: username,
                        productId: product?._id,
                        productName: product?.name,
                        productPrice: product?.price,
                        productCategory: product?.category,
                        imageURL: product?.image[0],
                    }
                    API.wishListPost(body)
                        .then(console.log)
                        .catch(console.log)
                    
                    setModal(true)
                }
            })
            .catch(err => {
                if(confirm('장바구니에 담으려면 로그인하셔야 합니다. 로그인 하시겠습니까?') === true) {
                    router.replace('/user/login')
                }
            })
    }

    return (
        <div>
            <Header />
            <div className={styles.container}>
                {/* 사진 부분 */}
                <div className={styles.imageContainer}>
                    <ImageSlider product={product} />
                    
                </div>
                {/* 내용 부분 */}
                <div className={styles.contents}>
                    {/* 상품 제목, 가격, 설명 */}
                    <div className={styles.productInfo}>
                        <div className={styles.name}>[{category[product?.category]}] {product?.name}</div>
                        <div className={styles.price}>{product?.price}원</div>
                        <div className={styles.description}>{product?.description}</div>
                    </div>
                    {/* 작상자, 등록일자 */}
                    <div className={styles.postedInfo}>
                        <div className={styles.posted}>작성자 : {product?.posted}</div>
                        <div className={styles.createAt}>동록일자 : {product?.createAt.split('T')[0]}</div>
                    </div>
                    {/* 구매 수량 및 금액 */}
                    <div className={styles.selectProduct}>
                        <div className={styles.selectProductName}>[{category[product?.category]}] {product?.name}</div>
                        <div className={styles.optionsContents}>
                            <div className={styles.optionsBtn}>
                                <button className={styles.amountBtn} onClick={minus}>-</button>
                                    <span>{amount}</span>
                                <button className={styles.amountBtn} onClick={plus}>+</button>
                            </div>
                            <div className={styles.eachPrice}>
                                {product?.price}원
                            </div>
                        </div>
                    </div>
                    {/* 총금액 계산 */}
                    <div className={styles.totalPrice}>
                        <div className={styles.priceText}>총금액</div>
                        <div className={styles.totalPriceValue}>{product?.price * amount}원</div>
                    </div>
                    {/* 구매하기, 장바구니, 찜 버튼 */}
                    <div className={styles.buttonContainer}>
                        <button className={styles.heartBtn} onClick={likedSave}>{heart ? <HeartFilled /> : <HeartOutlined />}</button>
                        <button className={styles.cartBtn} onClick={cartSave}>장바구니</button>
                        <button className={styles.buyBtn}>구매하기</button>
                    </div>
                </div>
            </div>

            {/* 리뷰 부분 */}

            {/* 장바구니 등록 모달 */}
            {
                modal ?
                <div className={styles.modal}>
                    <div className={styles.openModal}>
                        <div className={styles.modalHeader}>
                            장바구니 <button onClick={() => setModal(false)}>&times;</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div>장바구니에 담았습니다. 장바구니로 이동하시겠습니까?</div>
                            <div className={styles.cartBtnContainer}>
                                <button className={styles.keepShop} onClick={() => setModal(false)}>쇼핑 더 하기</button>
                                <button className={styles.moveCart} onClick={() => router.replace('/user/cart')}>장바구니로 이동</button>
                            </div>
                        </div>
                    </div>
                </div> : null
            }
        </div>
    )
}