import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Header from '../../component/header'
import API from '../../api-server'

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
        setProduct(data)
    }

    return (
        <div>
            <Header />
            <div>
                {/* 사진 부분 */}
                <div>

                </div>
                {/* 내용 부분 */}
                <div>

                </div>
            </div>
        </div>
    )
}