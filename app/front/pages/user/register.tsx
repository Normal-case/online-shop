import React, { useState } from 'react'
import Link from 'next/link'
import API from '../../api-server'

export default function Register() {

    const [errorMsg, setErrorMsg] = useState("")

    const sendRegisterForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = e.target as HTMLFormElement
        const body: Object = {
            name: formData.name.value,
            username: formData.username.value,
            password: formData.password.value

        }
        if (formErrorHandler(formData)) {
            API.registerPost(body).then(res => handleGetResponse(res))
        }
    }

    const handleGetResponse = (res: Object) => {
        if(res.data.success) {
            alert('회원가입이 완료되었습니다.')
            location.href = '/user/login'
        } else {
            setErrorMsg(res.data.msg)
        }
    }

    const formErrorHandler = (formData: HTMLFormElement) => {
        const name = formData.name.value
        const username = formData.username.value
        const psword = formData.password.value
        const pswordConfirm = formData.passwordConfirm.value

        if (!name || !username) {
            setErrorMsg("이름 혹은 아이디를 입력해주세요")
            return false
        }

        if (passwordPolicy(psword, pswordConfirm)) {
            setErrorMsg("")
            return true
        } else {
            return false
        }

    }

    const passwordPolicy = (psword: String, pswordConfirm: String) => {
        // password is required
        if (!psword || !pswordConfirm) {
            setErrorMsg('비밀번호를 입력해주세요')
            return false
        }

        // password should include number and alphabet. 8 <= length <= 20
        var includePs = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/
        if (!includePs.test(psword)) {
            setErrorMsg("비밀번호 정책을 확인해주세요")
            return false
        }

        // password and passwordConfirm should be same
        if (psword !== pswordConfirm) {
            setErrorMsg("비밀번호가 일치하지 않습니다")
            return false
        }

        return true
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
                        <p className="error-message">{errorMsg}</p>
                        <button>회원가입</button>
                        <p className='message'>이미 회원이신가요? <Link href="/user/login" legacyBehavior><a>로그인하기</a></Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}