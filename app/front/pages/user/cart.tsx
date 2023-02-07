import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Header from '../../component/header'
import API from '../../api-server'

export default function Cart() {

    const router = useRouter()

    useEffect(() => {
        API.tokenVerify()
            .then(console.log)
            .catch(err => {
                if(err.response) {
                    router.replace('/user/login')
                }
            })
    }, [])

    return (
        <div>
            <Header />
            <h1>쇼핑카트</h1>
            <button><Link href='/'>Home</Link></button>
        </div>
    )
}