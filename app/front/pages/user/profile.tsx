import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import DaumPostcodeEmbed from 'react-daum-postcode'

import Header from '../../component/header'
import styles from '../../styles/Profile.module.css'
import API from '../../api-server'
import { getCookie } from 'cookies-next'
import { setToken } from '../../module/Token'
import ProfileInfo from '../../component/profile/profileInfo'
import CreateProduct from '../../component/profile/createProduct'

export default function Profile() {
    const router = useRouter()
    const [menuData, setMenuData] = useState(['내정보', '결제완료', '상품준비중', '출고시작', '배송중', '배송완료'])
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
    var [file, setFile] = useState('http://localhost:8000/profile/profile.png')

    

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
        const profile = res.data.profile
        if(profile.authority === 'manager') {
            let tmpMenu = [...menuData]
            if(tmpMenu.length === 6) setMenuData([...tmpMenu, '물품등록'])
        }
        setProfile(profile)
        setSrc(profile.pImage)
        setFile(profile.pImage)
        setNickname(profile.name)
        setZoneCode(profile.zoneCode)
        setAddress(profile.address)
        setDetail(profile.detail)
        setNickname(profile.name)
    }

    const profileUpdate = async () => {
        if(updateProfile) {
            setUpdateProfile(false)
            let formData = new FormData()
            const username = getCookie('user')
            const key = ['zoneCode', 'address', 'detail', 'nickname', 'username']
            const value = [zoneCode, address, detail, nickname, username]
            formData.append('img', file)
            for (var i=0;i<key.length;i++) {
                formData.append(key[i], value[i])
            }
            API.profileUpdate(formData)
                .then(console.log)
                .catch(console.log)
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

    const profileInfoVariable = {
        profileImage: profileImage,
        src: src,
        updateProfile: updateProfile,
        nickname: nickname,
        point: profile?.point,
        zoneCode: zoneCode,
        address: address,
        detail: detail
    }

    const profileInfoFunction = {
        handleProfileImage: handleProfileImage,
        changeNickname: changeNickname,
        addressInput: addressInput,
        detailChange: detailChange,
        profileUpdate: profileUpdate
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
                          menuIdx === 6 ?
                            <CreateProduct setMenuIdx={setMenuIdx} /> : null
                        }
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
