import React from 'react'

import styles from '../../styles/component/CreateProduct.module.css'

export default function CreateProduct() {

    const selectOptions = [
        { value: 'category', name: '종류' },
        { value: 'outer', name: '아웃터' },
        { value: 'onePiece', name: '원피스' },
        { value: 'knit', name: '니트' },
        { value: 'tShirt', name: '티셔츠' },
        { value: 'blouse', name: '블라우스' },
        { value: 'skirt', name: '스커트' },
        { value: 'pants', name: '팬츠' },
        { value: 'underwear', name: '언더웨어' },

    ]

    return (
        <div className={styles.body}>
            <h2>상품등록</h2>

            <input className={styles.inputText} type='text' placeholder='상품명' /> <br />
            <select className={styles.options}>
                { selectOptions.map((option) => (
                    <option value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select> <input className={styles.inputPrice} type='number' placeholder='가격' />
            <br />
            <textarea className={styles.inputText} placeholder='상품설명' />

            <div>
                <label htmlFor='input-product-image'>
                    <div className={styles.productImage}>
                        <span>상품 이미지를 등록해주세요.</span>
                    </div>
                </label>
                <input
                    type='file'
                    id='input-product-image'
                    accept='image/*'
                    style={{ display: 'none' }}
                />
            </div>

            <button className={styles.submit}>상품 등록</button>
        </div>
    )
}