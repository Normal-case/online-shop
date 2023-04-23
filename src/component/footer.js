import React from 'react'
import styles from '../styles/component/Footer.module.css'

export default function Footer() {

    return (
        <div className={styles.body}>
            <div className={styles.grid}>
                <div className={styles.title}>
                    Description
                </div>
                <div className={styles.descripton}>
                    <p>
                        이 페이지는 실제 온라인 쇼핑몰이 아닌 웹 페이지 제작 테스트를 위해 만들어진 페이지입니다. <br />
                        그러므로 해당 페이지의 상품은 전부 테스트 용이며 실제 판매하는 제품이 아닙니다. <br />
                        <br />
                        해당 사이트에서 사용된 이미지는 전부 unsplash 출처이며 상업적으로 판매하지 않습니다.
                    </p>
                </div>
            </div>
            <div className={styles.grid}>
                <div className={styles.title}>
                    Connect
                </div>
                {/* <p className={styles.descripton}>
                    이메일: 8282chan94@gmail.com
                </p> */}
                <p className={styles.descripton}>
                    github: &nbsp;
                    <span onClick={() => {
                        window.open('https://github.com/Normal-case/online-shop')
                    }}>
                        https://github.com/Normal-case/online-shop
                    </span>
                </p>
            </div>
        </div>
    )
}