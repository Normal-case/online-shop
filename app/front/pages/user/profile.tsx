import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { deleteCookie } from 'cookies-next'

import { tokenCheck } from '../../module/Token'

export default function Profile() {
    const router = useRouter()

    const checkAuth = async () => {
        /* useEffect couldn't use async function */
        const result = await tokenCheck()
        if (!result.success) {
            router.replace('/user/login')
        }
    }
    useEffect(() => {
        checkAuth()
    }, [])

    const logout = () => {
        deleteCookie('accesstoken')
        deleteCookie('refreshtoken')
        router.replace('/user/login')
    }

    return (
        <div>
            <h1>프로필 페이지입니다.</h1>
            <button><Link href='/'>Home</Link></button>
            <button onClick={logout}>log out</button>
        </div>
    )
}
