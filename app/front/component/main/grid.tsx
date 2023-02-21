import React, { useState, useEffect } from 'react'
import styles from '../../styles/component/Grid.module.css'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import API from '../../api-server'
import Image from 'next/image'

export default function Grid() {

    const [productList, setProductList] = useState([])

    useEffect(() => {
        API.productGet()
            .then(res => handleResponse(res.data))
            .catch(console.log)
    }, [])

    const handleResponse = (response) => {
        console.log(response)
        setProductList(response.product)
    }
    
    return (
        <div className={styles.container}>
            {
                productList?.map((product, idx) => {
                    console.log(product.image[0])
                    return (
                        <div className={styles.card}>
                            <div className={styles.image}>
                                <Image loader={() => product?.image[0]} src={product?.image[0]} width={260} height={370} alt='' />
                            </div>
                            <div className={styles.title}>{product.name}</div>
                            <div className={styles.price}>{product.price}원</div>
                            <div className={styles.footer}>
                                <div className={styles.count}>
                                    구매수 {product.purchase} | 리뷰수 {product.reviews}
                                </div>
                                <div className={styles.liked}><HeartOutlined /></div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}