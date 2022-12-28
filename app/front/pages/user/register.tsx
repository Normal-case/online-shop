import React from 'react'
import Link from 'next/link'
import API from '../../api-server'

export default function Register() {

    return (
        <div className="background">
            <div className="register-page">
                <div className='form'>
                    <form className='register-form'>
                        <input type="text" placeholder="name" name="" id="" />
                        <input type="text" placeholder="username" name="" id="" />
                        <input type="password" placeholder="password" name="" id="" />
                        <input type="password" placeholder="password confirm" name="" id="" />
                        <button>회원가입</button>
                        <p className='message'>이미 회원이신가요? <Link href="/user/login" legacyBehavior><a>로그인하기</a></Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}