

export default function Login() {
    return (
        <div className="user">
            <div className="user_option_container">
                <div className="user_option_register">
                    <div className="user_option_register_contents">
                        <h2 className="user_register_title">아직 회원이 아니신가요?</h2>
                        <p className="user_register_description">회원가입 후 다양한 이벤트를 체험해보세요. 많은 혜택을 통해 저렴한 가격으로 예쁜 옷을 구매할 수 있습니다.</p>
                        <button className="user_register_button">회원가입</button>
                    </div>
                </div>
                <div className="user_login_form">
                    <div className="user_login_form_container">
                        <h2 className="login_form_title">LOGIN</h2>
                        <form className="login_form">
                            <div className="forms_fieldset">
                                <div className="forms_field">
                                    <input type="email" placeholder="Email" className="form_field_input" />
                                </div>
                                <div className="forms_field">
                                    <input type="password" placeholder="Password" className="form_field_input" />
                                </div>
                            </div>
                            <div className="form_button">
                                <input type="submit" value="LOG IN" className="form_login_button" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}