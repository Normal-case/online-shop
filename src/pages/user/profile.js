import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import DaumPostcodeEmbed from 'react-daum-postcode'

import Header from '../../component/header'
import Footer from '../../component/footer'
import styles from '../../styles/Profile.module.css'
import API from '../../api-server'
import { setToken } from '../../module/Token'
import ProfileInfo from '../../component/profile/profileInfo'
import CreateProduct from '../../component/profile/createProduct'
import ProductStatus from '../../component/profile/productStatus'

export default function Profile() {
    const router = useRouter()
    const [menuData, setMenuData] = useState(['내정보', '결제완료', '상품준비중', '출고시작', '배송중', '배송완료'])
    const [menuIdx, setMenuIdx] = useState(0)

    const [profile, setProfile] = useState()
    const [modal, setModal] = useState(false)
    const [zoneCode, setZoneCode] = useState()
    const [address, setAddress] = useState()
    const [detail, setDetail] = useState()
    const [orderArr, setOrderArr] = useState([])
    const statusIdx = {
        1: 'paied',
        2: 'preparing',
        3: 'depart',
        4: 'shipping',
        5: 'delivered'
    }

    useEffect(() => {
        API.profile()
            .then(res => handleResponse(res))
            .catch(err => {
                if(err.response && !err.response.data.success) {
                    router.replace('/user/login')
                }
            })
    }, [])

    useEffect(() => {
        API.getOrderUser()
            .then(res => {
                if(res.data.success) setOrderArr(res.data.order)
            })
            .catch(console.log)
    }, [])

    const handleResponse = (res) => {
        if(res.data.accesstoken) {
            setToken(res.data.accesstoken)
        }
        const profile = res.data.profile
        if(profile.authority === 'manager') {
            let tmpMenu = [...menuData]
            if(tmpMenu.length === 6) setMenuData([...tmpMenu, '물품등록'])
        }
        setProfile(profile)
        setZoneCode(profile.zoneCode)
        setAddress(profile.address)
        setDetail(profile.detail)
    }

    const handleComplete = (data) => {
        setModal(false)
        setAddress(data.address)
        setZoneCode(data.zonecode)
    }

    const menuActive = (e) => {
        setMenuIdx(e.target.value)
    }

    const profileInfoVariable = {
        profile: profile,
        zoneCode: zoneCode,
        address: address,
        detail: detail
    }

    const profileInfoFunction = {
        setModal,
        setDetail,
    }

    return (
        <div className={styles.main_container}>
            <Header />
            <div className={styles.main_title}>
                <h1>마이페이지</h1>
            </div>
            <div className={styles.profile_layout}>
                <div className={styles.layout_menubar}>
                    <ul>
                        {menuData.map((menu, idx) => {
                            return (
                                <li
                                    value={idx}
                                    key={idx}
                                    onClick={menuActive}
                                    className={idx===menuIdx ? styles.active : ''}
                                >
                                    {menu}
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className={styles.layout_body}>
                    <div className={styles.body_contents}>
                        { menuIdx === 0 ?
                            <ProfileInfo variable={profileInfoVariable} function={profileInfoFunction} /> :
                          menuIdx === 1 ?
                            <ProductStatus 
                                orderArr={orderArr.paiedArr} 
                                status={statusIdx[menuIdx]}
                            /> :
                          menuIdx === 2 ?
                            <ProductStatus 
                                orderArr={orderArr.preparingArr} 
                                status={statusIdx[menuIdx]}
                            /> :
                          menuIdx === 3 ?
                            <ProductStatus 
                                orderArr={orderArr.departArr} 
                                status={statusIdx[menuIdx]}
                            /> :
                          menuIdx === 4 ?
                            <ProductStatus 
                                orderArr={orderArr.shippingArr} 
                                status={statusIdx[menuIdx]}
                            /> :
                          menuIdx === 5 ?
                            <ProductStatus 
                                orderArr={orderArr.deliveredArr} 
                                status={statusIdx[menuIdx]}
                            /> :
                          menuIdx === 6 ?
                            <CreateProduct setMenuIdx={setMenuIdx} type='create' /> : null
                        }
                    </div>
                </div>
            </div>
            <Footer />
            {
                modal ? 
                <div className={styles.modal}>
                    <div className={styles.openModal}>
                        <div className={styles.modalHeader}>
                            주소를 입력해주세요. <button onClick={() => setModal(false)}>&times;</button>
                        </div>
                        <DaumPostcodeEmbed onComplete={handleComplete} />
                    </div>
                </div>
                : null
            }
        </div>
    )
}
