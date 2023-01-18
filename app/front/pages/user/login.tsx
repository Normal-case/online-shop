import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons'

import API from '../../api-server'
import { setToken, tokenCheck } from '../../module/Token'

export default function Login() {
    const router = useRouter()

    const checkAuth = async () => {
        /* useEffect couldn't use async function */
        const result = await tokenCheck()
        if (result.success) {
            router.replace('/user/profile')
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const sendLoginForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = e.target as HTMLFormElement
        const body: Object = {
            username: formData.username.value,
            password: formData.password.value
        }
        API.loginPost(body)
            .then(res => {
                if (res.data.success) {
                    setToken(res.data.accesstoken, res.data.refreshtoken)
                    router.push('/')
                } else {
                    alert(res.data.msg)
                }
            })
    }

    return (
        <div className="user">
            <div className="user_option_container">
                {/* 소셜 로그인을 하는 공간 */}
                <div className="user_option_register">
                    <div className="user_option_register_contents">
                        <div className='social_login_button'>
                            <GoogleOutlined /> &nbsp;
                            <span>구글 아이디로 로그인</span>
                        </div>
                        <div className='social_login_button'>
                            <FacebookOutlined /> &nbsp;
                            <span>페이스북 아이디로 로그인</span>
                        </div>
                        {/* <h2 className="user_register_title">아직 회원이 아니신가요?</h2>
                        <p className="user_register_description">회원가입 후 다양한 이벤트를 체험해보세요. 많은 혜택을 통해 저렴한 가격으로 예쁜 옷을 구매할 수 있습니다.</p>
                        <button className="user_register_button">회원가입</button> */}
                    </div>
                </div>
                {/* 아이디와 비밀번호를 입력하는 div */}
                <div className="user_login_form">
                    <div className="user_login_form_container">
                        <h2 className="login_form_title">LOGIN</h2>
                        <form className="login_form" onSubmit={sendLoginForm}>
                            <div className="forms_fieldset">
                                <div className="forms_field">
                                    <input type="text" placeholder="username" className="form_field_input" name="username" />
                                </div>
                                <div className="forms_field">
                                    <input type="password" placeholder="Password" className="form_field_input" name="password" />
                                </div>
                            </div>
                            <div className="form_button">
                                <input type="submit" value="LOG IN" className="form_login_button" />
                            </div>
                        </form>
                        <div className='user_register_link'>
                            <p className='user_register_url'>
                                아직 회원이 아니신가요? <Link href="/user/register" legacyBehavior><a>회원가입하기</a></Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}