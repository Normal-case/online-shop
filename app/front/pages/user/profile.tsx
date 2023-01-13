import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { deleteCookie } from 'cookies-next'

import API from '../../api-server'
import { setToken } from '../../module/Token'

export default function Profile() {
    const router = useRouter()

    useEffect(() => {
        API.tokenVerify()
            .catch(error => {
                if(error) {
                    API.refreshVerify()
                        .then(res => {
                            setToken(res.data.accesstoken, null)
                        })
                        .catch(error => {
                            if(error) {
                                router.replace('/user/login')
                            }
                        })
                    // router.replace('/user/login')
                }
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
