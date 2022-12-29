import React, { useState } from 'react'
import Link from 'next/link'
import API from '../../api-server'

export default function Register() {

    const [pswordMsg, setPswordMsg] = useState("")

    const sendRegisterForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = e.target as HTMLFormElement
        const psword = formData.password.value
        const pswordConfirm = formData.passwordConfirm.value
        if(psword !== pswordConfirm) {
            setPswordMsg("비밀번호가 일치하지 않습니다.")
        } else {
            setPswordMsg("")
            const body: Object = {
                name: formData.name.value,
                username: formData.username.value,
                password: formData.password.value
    
            }
            API.registerPost(body)
                .then(console.log)
        }
    }

    return (
        <div className="background">
            <div className="register-page">
                <div className='form'>
                    <form className='register-form' onSubmit={sendRegisterForm}>
                        <input type="text" placeholder="name" name="name" />
                        <input type="text" placeholder="username" name="username" />
                        <input type="password" placeholder="password" name="password" />
                        <input type="password" placeholder="password confirm" name="passwordConfirm" id="" />
                        <p className="error-message">{pswordMsg}</p>
                        <button>회원가입</button>
                        <p className='message'>이미 회원이신가요? <Link href="/user/login" legacyBehavior><a>로그인하기</a></Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}