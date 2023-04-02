import React, { use, useEffect, useState } from 'react'
import Image from 'next/image'

import styles from '../../styles/Profile.module.css'
import { getCookie } from 'cookies-next'
import API from '../../api-server'

export default function ProfileInfo(props) {
    /* props
    variable
    profile: 프로필 내용
    zoneCode: 우편번호
    address: 주소
    detail: 상세주소

    function
    setModal: 모달은 parent에서 관리해야함
    setDetail: 디테일 변경은 받아와야함
    */
    const profile = props.variable.profile
    const [src, setSrc] = useState()
    const [file, setFile] = useState('http://localhost:8000/profile/profile.png')
    const [profileImage, setProfileImage] = useState()
    const [updateProfile, setUpdateProfile] = useState(false)
    const [nickname, setNickname] = useState()

    useEffect(() => {
        if(profile) {
            setSrc(profile.pImage)
            setNickname(profile.name)
        }
        
    }, [profile])

    const handleProfileImage = (e) => {
        setFile(e.target.files[0])
        setProfileImage(URL.createObjectURL(e.target.files[0]))
    }

    const changeNickname = (e) => {
        setNickname(e.target.value)
    }

    const addressInput = () => {
        if(!updateProfile) return
        props.function.setModal(true)
    }

    const detailChange = (e) => {
        props.function.setDetail(e.target.value)
    }

    const profileUpdate = async () => {
        if(updateProfile) {
            setUpdateProfile(false)
            let formData = new FormData()
            const username = getCookie('user')
            const key = ['zoneCode', 'address', 'detail', 'nickname', 'username']
            const value = [props.variable.zoneCode, props.variable.address, props.variable.detail, nickname, username]
            formData.append('img', file)
            for(var i=0;i<key.length;i++) {
                formData.append(key[i], value[i])
            }
            API.profileUpdate(formData)
                .then(console.log)
                .catch(console.log)
        } else {
            setUpdateProfile(true)
        }
    }

    return (
        <div>
            <div className={styles.profile_card}>
                <div className={styles.profile_image}>
                    {
                        updateProfile ?
                        <div>
                            <label htmlFor='input-image' id='profile_image_active'>
                                { profileImage ?
                                    <img src={profileImage} width={70} height={70} alt='' /> :
                                    <Image loader={() => src} src={src} width={70} height={70} alt='' />
                                }
                            </label>
                            <input type='file' id='input-image' accept='image/*' style={{ display: 'none'}} onChange={(e) => handleProfileImage(e)} />
                        </div> :
                        <div>
                            { profileImage ?
                                <img src={profileImage} width={70} height={70} alt='' /> :
                                <Image loader={() => src} src={src} width={70} height={70} alt='' />
                            }
                        </div>
                    }
                </div>
                <input type='file' style={{ display: 'none' }} />
                <div className={styles.card_contents}>
                    <p>
                        { updateProfile
                        ? <input type='text' placeholder='닉네임' value={nickname} onChange={changeNickname} />
                        : nickname + '님'
                        }
                    </p>
                    <p>적립포인트: {profile?.point}p</p>
                    <p>보유쿠폰: 0개</p>
                </div>
            </div>
            <div className={styles.address}>
                <div className={styles.address_head}>
                    <span>주소: </span><input type='text' placeholder='우편번호' value={props.variable.zoneCode} disabled></input><button className={updateProfile ? styles.address_button_active : styles.address_button} onClick={addressInput}>우편번호 찾기</button>
                </div>
                <div className={styles.address_tail}>
                    <input type='text' placeholder='주소' value={props.variable.address} disabled /><br />
                    <input type='text' placeholder='상세주소' disabled={updateProfile ? false : true} value={props.variable.detail} onChange={detailChange} />
                </div>
            </div>
            <div className={styles.profile_button} onClick={() => profileUpdate()}>
                { updateProfile ? '저장' : '프로필 수정하기' }
            </div>
        </div>
    )
}