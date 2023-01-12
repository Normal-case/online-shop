import React from 'react'
import { useRouter } from 'next/router'
import { deleteCookie } from 'cookies-next'

export default function Profile() {
    const router = useRouter()

    const logout = () => {
        deleteCookie('accesstoken')
        deleteCookie('refreshtoken')
        router.replace('/user/login')
    }

    return (
        <div>
            <h1>프로필 페이지입니다.</h1>
            <button onClick={logout}>log out</button>
        </div>
    )
}
