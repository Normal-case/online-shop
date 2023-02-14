import React, { useState } from 'react'

import styles from '../../styles/component/CreateProduct.module.css'
import API from '../../api-server'

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

    const [submitActive, setSubmitActive] = useState(false)
    const [productName, setProductName] = useState()
    const [productCategory, setProductCategory] = useState('category')
    const [productPrice, setProductPrice] = useState()
    const [productDesc, setProductDesc] = useState()
    const [imgList, setImgList] = useState([])
    
    const onSubmit = () => {
        if(!submitActive) return

        let formData = new FormData()
        const contents = {
            productName,
            productCategory,
            productPrice,
            productDesc
        }
        //formData.append('imgList', imgList)
        formData.append('productName', productName)
        formData.append('productCategory', productCategory)
        API.productCreate(formData)
            .then(console.log)
            .catch(console.log)
    }

    const changeProductName = (e: any) => {
        const value = e.target.value
        setProductName(value)

        if(value && productPrice && productDesc && productCategory !== 'category' && imgList.length !== 0) {
            setSubmitActive(true)
        } else {
            setSubmitActive(false)
        }
    }

    const changeCategory = (e: any) => {
        const value = e.target.value
        setProductCategory(value)

        if(productName && productPrice && productDesc && value !== 'category' && imgList.length !== 0) {
            setSubmitActive(true)
        } else {
            setSubmitActive(false)
        }
    }

    const changePrice = (e: any) => {
        const value = e.target.value
        setProductPrice(value)

        if(productName && value && productDesc && productCategory !== 'category' && imgList.length !== 0) {
            setSubmitActive(true)
        } else {
            setSubmitActive(false)
        }
    }

    const changeDesc = (e: any) => {
        const value = e.target.value
        setProductDesc(value)

        if(productName && productPrice && value && productCategory !== 'category' && imgList.length !== 0) {
            setSubmitActive(true)
        } else {
            setSubmitActive(false)
        }
    }

    const changeProductImage = (e: any) => {
        let files = e.target.files
        let tmpList = []
        
        if(productName && productPrice && productDesc && productCategory !== 'category' && files.length !== 0) {
            setSubmitActive(true)
        } else {
            setSubmitActive(false)
        }

        for(let i=0;i<files.length;i++) {
            tmpList.push(URL.createObjectURL(files[i]))
        }
        setImgList(tmpList)
    }

    return (
        <div className={styles.body}>
            <h2>상품등록</h2>

            <input className={styles.inputText} type='text' placeholder='상품명' onChange={changeProductName} /> <br />
            <select className={styles.options} onChange={changeCategory}>
                { selectOptions.map((option) => (
                    <option value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select> <input className={styles.inputPrice} type='number' placeholder='가격' onChange={changePrice} />
            <br />
            <textarea className={styles.inputText} placeholder='상품설명' onChange={changeDesc} />

            <div>
                <label htmlFor='input-product-image'>
                    <div className={styles.productImage}>
                        {
                            imgList.length !== 0 ?
                            imgList.map((img, idx) => {
                                return (
                                    <img src={img} height={200} alt='' />
                                )
                            }) :
                            <span>상품 이미지를 등록해주세요.</span>
                        }
                    </div>
                </label>
                <input
                    type='file'
                    id='input-product-image'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={changeProductImage}
                    multiple
                />
            </div>

            <button className={submitActive ? styles.submit : styles.submitDisabled} onClick={onSubmit}>상품 등록</button>
        </div>
    )
}