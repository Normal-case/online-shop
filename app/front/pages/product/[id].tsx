import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Header from '../../component/header'
import API from '../../api-server'
import ImageSlider from '../../component/ImageSlider'
import styles from '../../styles/component/ProductDetail.module.css'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import { getCookie } from 'cookies-next'
import ReviewModal from '../../component/modal/reviewModal'

export default function Product() {
    
    const router = useRouter()
    const user = getCookie('user')
    const [product, setProduct] = useState()
    const [amount, setAmount] = useState(1)
    const [modal, setModal] = useState(false)
    const [heart, setHeart] = useState(false)

    // 리뷰 평점
    const [totalRating, setTotalRating] = useState(5)
    const [reviewRating, setReviewRating] = useState(5)

    const [reviewModal, setReviewModal] = useState(false)
    const [reviewContents, setReviewContents] = useState('')
    const [imageList, setImageList] = useState([])
    const [fileList, setFileList] = useState([])

    const [reviewList, setReviewList] = useState([])
    const [reviewForUpdate, setReviewForUdpate] = useState({})
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

    useEffect(() => {
        if(router.isReady) {
            const { id } = router.query
            API.getReview(id)
                .then(res => {
                    if(res.data.success) {
                        reviewResponse(res.data)
                    }
                })
                .catch(console.log)
        }
    }, [router])

    const handleResponse = (data: Object) => {
        console.log(data.product)
        const product = data?.product
        const username = getCookie('user')
        setProduct(product)

        let rate
        if(product.reviews === 0) {
            rate = 0
        } else {
            rate = Math.round(product.ratingSum / product.reviews * 10) / 10
        }
        setTotalRating(rate)

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

    const reviewResponse = (data:Object) => {
        setReviewList(data.review)
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
                        amount: amount
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

    const buyProduct = () => {
        API.tokenVerify()
            .then(res => {
                if(res.data.success) {
                    const body = {
                        data: [{
                            productId: product?._id,
                            amount: amount
                        }]
                    }
                    API.order(body)
                        .then(res => {
                            if(res.data.success) {
                                router.replace(`/order/${res.data.orderId}`)
                            }
                        })
                        .catch(console.log)
                }
            })
            .catch(err => {
                if(confirm('구매하시려면 로그인하셔야 합니다. 로그인 하시겠습니까?') === true) router.replace('/user/login')
            })
    }

    const openModal = () => {
        setReviewForUdpate({})
        setImageList([])
        setReviewRating(5)
        setReviewModal(true)
    }

    const rateChange = (idx: number) => {
        setReviewRating(idx+1)
    }

    const reviewRateRendering = (rate: number, click: boolean) => {
        var result = []
        for(var i=0;i<5;i++) {
            var heart
            const idx = i
            if(i < rate) {
                if(click) {
                    heart = <li 
                                key={i} 
                                className={styles.heartEle}
                                onClick={() => rateChange(idx)}
                            >
                                <HeartFilled />
                            </li>
                } else {
                    heart = <li 
                                key={i} 
                                className={styles.heartEleUnClick}
                            >
                                <HeartFilled />
                            </li>
                }

            } else {
                if(click) {
                    heart = <li 
                                key={i} 
                                className={styles.heartEle}
                                onClick={() => rateChange(idx)}
                            >
                                <HeartOutlined />
                            </li>                    
                } else {
                    heart = <li 
                                key={i} 
                                className={styles.heartEleUnClick}
                            >
                                <HeartOutlined />
                            </li>
                }
            }
            result.push(heart)
        }

        return result
    }

    const changeDesc = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReviewContents(e.target.value)
    }

    const changeProductImage = (e: any) => {
        let files = e.target.files
        let tmpImageList = []
        let tmpFileList = []
        for(let i=0;i<files.length;i++) {
            tmpImageList.push(URL.createObjectURL(files[i]))
            tmpFileList.push(files[i])
        }
        setImageList(tmpImageList)
        setFileList(tmpFileList)
    }

    const onSubmitReview = () => {
        if(reviewContents.replace(/(\s*)/g, "").length < 10) {
            alert('리뷰를 10글자 이상 작성해주세요.')
            return
        }
        const body = {
            productId: product?._id,
            rating: reviewRating,
            contents: reviewContents
        }
        const formData = new FormData()
        fileList.forEach(image => {
            formData.append('img', image)
        })
        for(let key in body) {
            formData.append(key, body[key])
        }
        API.createReview(formData)
            .then(res => {
                if(res.data.success) {
                    alert('리뷰가 성공적으로 작성되었습니다.')
                    router.reload()
                }
            })
            .catch(err => {
                console.log(err)
                if(err.response.data.type === 'exist') {
                    alert('이미 작성한 댓글이 있습니다.')
                } else if(err.response.data.type === 'buy') {
                    alert('이 상품을 구매하지 않아 리뷰를 작성할 수 없습니다.')
                }
            })
    }

    const reviewUpdate = (review: Object) => {
        setReviewForUdpate(review)
        setImageList(review.image)
        setReviewRating(review.rating)
        setReviewModal(true)
    }

    const variable = {
        reviewRating,
        imageList
    }

    const func = {
        setReviewModal,
        reviewRateRendering,
        changeDesc,
        changeProductImage,
        onSubmitReview
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
                        <button className={styles.buyBtn} onClick={buyProduct}>구매하기</button>
                    </div>
                </div>
            </div>

            {/* 리뷰 부분 */}
            <div className={styles.reviewContainer}>
                <div className={styles.reviewHeader}>
                    <div className={styles.title}>
                        구매후기
                    </div>
                    <div className={styles.reviewCreate} onClick={openModal}>
                        리뷰작성
                    </div>
                </div>
                <div className={styles.ratingAvg}>
                    <div className={styles.neo}>
                        구매 평점
                    </div>
                    <div className={styles.ratingValue}>
                        <div className={styles.neo}>
                            리뷰수: {product?.reviews}개
                        </div>
                        <div className={styles.neo}>
                            {totalRating} / 5
                        </div>
                        <ul className={styles.heartTotal}>
                            {reviewRateRendering(totalRating, false)}
                        </ul>
                    </div>
                </div>

                {/* 리뷰 목록 */}
                <table className={styles.reviewTable}>
                    <tbody>
                        {
                            reviewList?.map((review, idx) => {
                                return (
                                    <tr>
                                        <td className={styles.left}>
                                            <div className={styles.profile}>
                                                <div>
                                                    <img 
                                                        src={review.pImage}
                                                        width={80}
                                                        height={80}
                                                        className={styles.profileImg}
                                                    />
                                                </div>
                                                <div className={styles.username}>
                                                    {review.nickname}
                                                </div>
                                            </div>
                                            {
                                                user === review.username ?
                                                <div className={styles.ownReview}>
                                                    <span 
                                                        onClick={                               () => reviewUpdate(review)
                                                        }
                                                    >
                                                        수정하기
                                                    </span>
                                                    <span>삭제하기</span>
                                                </div> : null
                                            }
                                        </td>
                                        <td className={styles.right}>
                                            <ul className={styles.heartDisplay}>
                                                {
                                                    reviewRateRendering(review.rating, false)
                                                }
                                            </ul>
                                            <span>
                                                {review.contents}
                                            </span>
                                            <div className={styles.productImgContainer}>
                                                {
                                                    review.image.map((img) => {
                                                        return (
                                                            <img
                                                                src={img}
                                                                width={130}
                                                                height={150}
                                                                className={
                                                                    styles.productImg
                                                                }
                                                            />
                                                        )            
                                                    })
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        
                    </tbody>
                </table>

            </div>
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
            {/* 리뷰작성 모달 */}
            {
                reviewModal ?
                <ReviewModal 
                    variable={variable} 
                    func={func} 
                    review={reviewForUpdate}
                /> : null
            }
        </div>
    )
}