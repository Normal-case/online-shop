import React, { useState } from 'react'
import { useRouter } from 'next/router'

import styles from '../../styles/component/CreateProduct.module.css'
import API from '../../api-server'

export default function CreateProduct(props: any) {
    /* setMenuIdx: form 초기화를 위한 메뉴 인덱스 함수 */ 
    const router = useRouter()
    const selectOptions = [
        { value: 'category', name: '종류' },
        { value: 'outer', name: '아웃터' },
        { value: 'onePiece', name: '원피스' },
        { value: 'knit', name: '니트' },
        { value: 'tShirt', name: '티셔츠' },
        { value: 'blouse', name: '블라우스' },
        { value: 'skirt', name: '스커트' },
        { value: 'pants', name: '팬츠' },
    ]

    const [submitActive, setSubmitActive] = useState(
        props.product ? true : false
    )
    const [productName, setProductName] = useState(props.product?.name)
    const [productCategory, setProductCategory] = useState(
        props.product?.category || 'category'
    )
    const [productPrice, setProductPrice] = useState(props.product?.price)
    const [productDesc, setProductDesc] = useState(props.product?.description)
    const [imgList, setImgList] = useState(props.product?.image || [])
    const [fileList, setFileList] = useState([])

    const onSubmit = async () => {
        if(!submitActive) return

        const formData = new FormData()
        const contents = {
            productName,
            productCategory,
            productPrice,
            productDesc
        }

        if(fileList.length === 0 && props.type === 'update') {
            let tmpFileList = []
            for(let i=0;i<imgList.length;i++) {
                const response = await fetch(imgList[i])
                const blob = await response.blob()
                const imgFile = new File([blob], 'image.jpg', { type: blob.type })
                tmpFileList.push(imgFile)
            }
            tmpFileList.forEach(image => {
                formData.append('img', image)
            })
            formData.append('id', props.product._id)
        } else {
            fileList.forEach(image => {
                formData.append('img', image)
            })
        }

        for(let key in contents) {
            formData.append(key, contents[key])
        }

        if(props.type === 'create') {
            API.productCreate(formData)
                .then(res => {
                    if(res.data.success) {
                        alert('물품이 성공적으로 등록되었습니다.')
                        props.setMenuIdx(0)
                    }
                })
                .catch(console.log)
        } else {
            API.productUpdate(formData)
                .then(res => {
                    if(res.data.success) {
                        alert('물품이 성공적으로 수정되었습니다.')
                        router.reload()
                    }
                })
                .catch(console.log)
        }
        
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
        let tmpImageList = []
        let tmpFileList = []
        
        if(productName && productPrice && productDesc && productCategory !== 'category' && files.length !== 0) {
            setSubmitActive(true)
        } else {
            setSubmitActive(false)
        }

        for(let i=0;i<files.length;i++) {
            tmpImageList.push(URL.createObjectURL(files[i]))
            tmpFileList.push(files[i])
        }
        setImgList(tmpImageList)
        setFileList(tmpFileList)
    }

    return (
        <div className={styles.body}>
            <h2>상품등록</h2>

            <input 
                className={styles.inputText} 
                type='text' 
                placeholder='상품명' 
                onChange={changeProductName}
                value={productName}
            /> <br />
            <select 
                className={styles.options} 
                onChange={changeCategory}
                defaultValue={productCategory}
            >
                { selectOptions.map((option) => (
                    <option value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select> 
            <input 
                className={styles.inputPrice} 
                type='number' 
                placeholder='가격' 
                onChange={changePrice} 
                value={productPrice}
            />
            <br />
            <textarea 
                className={styles.inputTextarea} 
                placeholder='상품설명' 
                onChange={changeDesc}
                value={productDesc}
            />

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
                    name='img'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={changeProductImage}
                    multiple
                />
            </div>

            <button 
                className={submitActive ? styles.submit : styles.submitDisabled} onClick={onSubmit}
            >
                { props.type === 'create' ? <span>상품 등록</span> : <span>상품 수정</span>}
            </button>
        </div>
    )
}