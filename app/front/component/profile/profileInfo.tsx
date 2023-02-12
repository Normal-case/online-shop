import React from 'react'
import Image from 'next/image'

import styles from '../../styles/Profile.module.css'

export default function ProfileInfo(props: any) {
    /* props
    variable
    profileImage : 프로필 이미지가 저장되어 있는지 여부
    src : 기본 디폴트 profile.png가 저장된 경로
    updateProfile: 프로필 업데이트 상태
    nickname: 프로필 닉네임
    point: 적립 포인트
    zoneCode: 우편번호
    address: 주소
    detail: 상세주소

    function
    handleProfileImage : 프로필 사진을 사용자가 로컬에서 업로드하면 저장되게 바꾸는 함수
    changeNickname: 닉네임 state 변경 함수
    addressInput: 주소 찾기 모달 키는 함수
    detailChanage: 상세주소 변경 함수
    profileUpdate: 프로필 내용을 전송하는 함수
    */

    return (
        <div>
            <div className={styles.profile_card}>
                <div className={styles.profile_image}>
                    {
                        props.variable.updateProfile ?
                        <div>
                            <label htmlFor='input-image' id='profile_image_active'>
                                { props.variable.profileImage ?
                                    <img src={props.variable.profileImage} width={70} height={70} alt='' /> :
                                    <Image loader={() => props.variable.src} src={props.variable.src} width={70} height={70} alt='' />
                                }
                            </label>
                            <input type='file' id='input-image' accept='image/*' style={{ display: 'none'}} onChange={(e) => props.function.handleProfileImage(e)} />
                        </div> :
                        <div>
                            { props.variable.profileImage ?
                                <img src={props.variable.profileImage} width={70} height={70} alt='' /> :
                                <Image loader={() => props.variable.src} src={props.variable.src} width={70} height={70} alt='' />
                            }
                        </div>
                    }
                </div>
                <input type='file' style={{ display: 'none' }} />
                <div className={styles.card_contents}>
                    <p>
                        { props.variable.updateProfile
                        ? <input type='text' placeholder='닉네임' value={props.variable.nickname} onChange={props.function.changeNickname} />
                        : props.variable.nickname + '님'
                        }
                    </p>
                    <p>적립포인트: {props.variable.point}p</p>
                    <p>보유쿠폰: 0개</p>
                </div>
            </div>
            <div className={styles.address}>
                <div className={styles.address_head}>
                    <span>주소: </span><input type='text' placeholder='우편번호' value={props.variable.zoneCode} disabled></input><button className={props.variable.updateProfile ? styles.address_button_active : styles.address_button} onClick={props.function.addressInput}>우편번호 찾기</button>
                </div>
                <div className={styles.address_tail}>
                    <input type='text' placeholder='주소' value={props.variable.address} disabled /><br />
                    <input type='text' placeholder='상세주소' disabled={props.variable.updateProfile ? false : true} value={props.variable.detail} onChange={props.function.detailChange} />
                </div>
            </div>
            <div className={styles.profile_button} onClick={() => props.function.profileUpdate()}>
                { props.variable.updateProfile ? '저장' : '프로필 수정하기' }
            </div>
        </div>
    )
}