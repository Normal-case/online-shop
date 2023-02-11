import React, { useState } from 'react'
import Image from 'next/image'

import styles from '../../styles/Profile.module.css'

export default function ProfileInfo(props: any) {
    /* props
    variable
    profileImage : 프로필 이미지가 저장되어 있는지 여부
    src : 기본 디폴트 profile.png가 저장된 경로

    function
    handleProfileImage : 프로필 사진을 사용자가 로컬에서 업로드하면 저장되게 바꾸는 함수
    */

    const [updateProfile, setUpdateProfile] = useState(false)

    return (
        <div className={styles.profile_card}>
            <div className={styles.profile_image}>
                {
                    updateProfile ?
                    <div>
                        <label htmlFor='input-image' id='profile_image_active'>
                            { props.profileImage ?
                                <img src={props.profileImage} width={70} height={70} alt='' /> :
                                <Image loader={() => props.src} src={props.src} width={70} height={70} alt='' />
                            }
                        </label>
                        <input type='file' id='input-image' accept='image/*' style={{ display: 'none'}} onChange={(e) => props.handleProfileImage(e)} />
                    </div> :
                    <div>
                        { props.profileImage ?
                            <img src={props.profileImage} width={70} height={70} alt='' /> :
                            <Image loader={() => props.src} src={props.src} width={70} height={70} alt='' />
                        }
                    </div>
                }
            </div>
        </div>
    )
}