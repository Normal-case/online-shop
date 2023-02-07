import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import DaumPostcodeEmbed from 'react-daum-postcode'

import Header from '../../component/header'
import styles from '../../styles/Profile.module.css'
import API from '../../api-server'
import { getCookie } from 'cookies-next'
import { setToken } from '../../module/Token'

export default function Profile() {
    const router = useRouter()
    let menuData = ['내정보', '결제완료', '상품준비중', '출고시작', '배송중', '배송완료']
    const [menuIdx, setMenuIdx] = useState(0)

    const [profile, setProfile] = useState()
    const [src, setSrc] = useState('')
    const [profileImage, setProfileImage] = useState()
    const [updateProfile, setUpdateProfile] = useState(false)
    const [modal, setModal] = useState(false)
    const [zoneCode, setZoneCode] = useState()
    const [address, setAddress] = useState()
    const [detail, setDetail] = useState()
    const [nickname, setNickname] = useState()
    const [file, setFile] = useState('http://localhost:8000/profile/profile.png')

    useEffect(() => {
        API.profile()
            .then(res => handleResponse(res))
            .catch(err => {
                if(err.response && !err.response.data.success) {
                    router.replace('/user/login')
                }
            })
    }, [])

    const handleResponse = (res: any) => {
        if(res.data.accesstoken) {
            setToken(res.data.accesstoken)
        }
        console.log(res.data)
        const profile = res.data.profile
        setProfile(profile)
        setSrc(profile.pImage)
        setFile(profile.pImage)
        setNickname(profile.name)
        setZoneCode(profile.zoneCode)
        setAddress(profile.address)
        setDetail(profile.detail)
        setNickname(profile.name)
    }

    const profileUpdate = () => {
        if(updateProfile) {
            setUpdateProfile(false)
            let formData = new FormData()
            const username = getCookie('user')
            const key = ['zoneCode', 'address', 'detail', 'nickname', 'username']
            const value = [zoneCode, address, detail, nickname, username]
            console.log(file)
            console.log(src)
            formData.append('img', file)
            for (var i=0;i<key.length;i++) {
                formData.append(key[i], value[i])
            }
            // API.profileUpdate(formData)
            //     .then(console.log)
            //     .catch(console.log)
        } else {
            setUpdateProfile(true)
        }
    }

    const addressInput = () => {
        if(!updateProfile) return
        setModal(true)
    }

    const handleComplete = (data: Object) => {
        setModal(false)
        setAddress(data.address)
        setZoneCode(data.zonecode)
    }

    const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files[0])
        setProfileImage(URL.createObjectURL(e.target.files[0]))
    }

    const detailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetail(e.target.value)
    }

    const changeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value)
    }

    const menuActive = (e) => {
        setMenuIdx(e.target.value)
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
                        <div className={styles.profile_card}>
                            <div className={styles.profile_image}>
                                {
                                    updateProfile ?  
                                    <div><label htmlFor='input-image' id='profile_image_active'>
                                    { profileImage ?
                                        <img src={profileImage} width={70} height={70} alt='' /> :
                                        <Image loader={() => src} src={src} width={70} height={70} alt='' />
                                    }</label>
                                    <input type='file' id='input-image' accept='image/*' style={{ display: 'none'}} onChange={(e) => handleProfileImage(e)} /></div> :
                                    <div>
                                    { profileImage ?
                                        <img src={profileImage} width={70} height={70} alt='' /> :
                                        <Image loader={() => src} src={src} width={70} height={70} alt='' />
                                    }
                                    </div>
                                }
                                
                            </div>
                            <input type='file' style={{ display: 'none'}} />
                            <div className={styles.card_contents}>
                                <p>
                                    {updateProfile 
                                    ? <input type='text' placeholder='닉네임' value={nickname} onChange={changeNickname}></input> 
                                    : nickname + '님' }
                                </p>
                                <p>적립포인트: {profile?.point}p</p>
                                <p>보유쿠폰: 0개</p>
                            </div>
                        </div>
                        <div className={styles.address}>
                            <div className={styles.address_head}>
                                주소: <input type='text' placeholder='우편번호' value={zoneCode} disabled></input><button className={updateProfile ? styles.address_button_active : styles.address_button} onClick={addressInput}>우편번호 찾기</button>
                            </div>
                            <div className={styles.address_tail}>
                                <input type='text' placeholder='주소' value={address} disabled></input><br />
                                <input type='text' placeholder='상세주소' disabled={updateProfile ? false : true} value={detail} onChange={detailChange}></input>
                            </div>
                        </div>
                        <div className={styles.profile_button} onClick={() => profileUpdate()}>
                            {updateProfile ? '저장' : '프로필 수정하기'}
                        </div>
                    </div>
                </div>
            </div>
            {
                modal ? 
                <div className={styles.modal}>
                    <div className={styles.open_modal}>
                        <div className={styles.modal_header}>
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
