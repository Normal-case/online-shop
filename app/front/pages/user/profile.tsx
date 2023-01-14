import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { deleteCookie, getCookie } from 'cookies-next'

import API from '../../api-server'
import { setToken, tokenCheck } from '../../module/Token'

export default function Profile() {
    const router = useRouter()

    useEffect(() => {
        API.tokenVerify()
            .catch(err => {
                const RToken = getCookie('refreshtoken')
                if(!RToken) router.replace('/user/login')

                API.refreshVerify()
                    .then(res => {
                        setToken(res.data.accesstoken, '')
                    })
                    .catch(err => {
                        router.replace('/user/login')
                    })
            })
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
