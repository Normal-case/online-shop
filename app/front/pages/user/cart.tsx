import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import API from '../../api-server'

export default function Cart() {

    const router = useRouter()

    useEffect(() => {
        API.tokenVerify()
            .catch(error => {
                if(error) {
                    router.replace('/user/login')
                }
            })
    }, [])
    return (
        <div>
            <h1>쇼핑카트</h1>
            <button><Link href='/'>Home</Link></button>
        </div>
    )
}