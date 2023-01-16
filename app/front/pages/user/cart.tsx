import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { tokenCheck } from '../../module/Token'
import Header from '../../component/header'

export default function Cart() {

    const router = useRouter()

    const checkAuth = async () => {
        const result = await tokenCheck()
        if(!result.success) {
            router.replace('/user/login')
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <div>
            <Header />
            <h1>쇼핑카트</h1>
            <button><Link href='/'>Home</Link></button>
        </div>
    )
}