import React, { useState } from 'react'

import styles from '../../styles/component/ProductDetail.module.css'

export default function ReviewModal({ variable, func, review }) {
    /* 
    variable
    - reviewRating
    - imageList
    - reviewContents

    func
    - setReviewModal
    - reviewRateRendering
    - changeDesc
    - changeProductImage
    - onSubmitReview
    */
    
    return (
        <div className={styles.modal}>
            <div className={styles.openModalReview}>
                <div className={styles.modalHeader}>
                    리뷰를 등록해주세요.
                    <button onClick={() => func.setReviewModal(false)}>
                        &times;
                    </button>
                </div>
                <div className={styles.modalBody}>
                    상품 평점을 남겨주세요.
                    <ul className={styles.heartModal}>
                        {
                            func.reviewRateRendering(
                                variable.reviewRating, true
                            )
                        }
                    </ul>
                    <textarea
                        className={styles.reviewText}
                        placeholder='소중한 리뷰 작성부탁드립니다. 최소 10글자 이상 입력해주세요.'
                        onChange={func.changeDesc}
                        value={variable.reviewContents}
                    />
                    <label htmlFor='input-product-review-image'>
                        <div className={styles.productImage}>
                            {
                                variable.imageList.length !== 0 ?
                                variable.imageList.map((img, idx) => {
                                    return (
                                        <img src={img} height={120} alt='' />
                                    )
                                }) :
                                <span>
                                    리뷰 이미지는 4장까지 등록가능합니다.
                                </span>
                            }
                        </div>
                    </label>
                    <input
                        type='file'
                        id='input-product-review-image'
                        name='img'
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={func.changeProductImage}
                        multiple
                    />
                    <button 
                        className={styles.submitReview} 
                        onClick={
                            review.contents ?
                            func.onSubmitReviewUpdate :
                            func.onSubmitReview
                        }
                    >
                        {
                            review.contents ? 
                            <span>리뷰 수정</span> : 
                            <span>리뷰 쓰기</span>
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}