import React, { useState, useEffect } from 'react'
import styles from '../../styles/component/Grid.module.css'
import API from '../../api-server'
import ImageSlider from '../ImageSlider'
import Link from 'next/link'

export default function Grid({ filter }) {

    const [productList, setProductList] = useState([])

    useEffect(() => {
        API.productGet(filter)
            .then(res => handleResponse(res.data))
            .catch(console.log)
    }, [filter])

    const handleResponse = (response) => {
        setProductList(response.product)
    }
    
    return (
        <div className={styles.container}>
            {
                productList?.map((product, idx) => {
                    return (
                        <div className={styles.card}>
                            <div className={styles.image}>
                                <ImageSlider product={product} />
                            </div>
                            <Link href={`/product/${product?._id}`}>
                                <div className={styles.title}>{product?.name}</div>
                            </Link>
                            <div className={styles.price}>{product.price}원</div>
                            <div className={styles.footer}>
                                <div className={styles.count}>
                                    구매수 {product.purchase} | 리뷰수 {product.reviews}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}