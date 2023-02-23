import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Header from '../../component/header'
import API from '../../api-server'
import ImageSlider from '../../component/ImageSlider'
import styles from '../../styles/component/ProductDetail.module.css'

export default function Product() {
    
    const router = useRouter()
    const [product, setProduct] = useState()

    useEffect(() => {
        if(router.isReady) {
            const { id } = router.query
            API.productDetail(id)
                .then(res => handleResponse(res.data))
                .catch(console.log)
        }
        
    }, [router])

    const handleResponse = (data) => {
        setProduct(data.product)
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
                    <div className={styles.name}>{product?.name}</div>
                    <div className={styles.price}>{product?.price}</div>
                    <div className={styles.description}>{product?.description}</div>

                </div>
            </div>
        </div>
    )
}