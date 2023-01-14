import axios from 'axios'
import { setCookie, getCookie } from 'cookies-next'

import API from '../api-server'

const setToken = (accesstoken: string, refreshtoken: string) => {
    axios.defaults.headers.Authorization = 'Bearer ' + accesstoken
    setCookie('accesstoken', accesstoken)
    if(refreshtoken) {
        setCookie('refreshtoken', refreshtoken)
    }
}

const tokenCheck = async () => {
    try {
        const ATVerify = await API.tokenVerify()
        return { success: true }
    } catch {
        const RToken = getCookie('refreshtoken')
        if(!RToken) return { success: false, msg: 'refresh token empty' }

        try {
            const RTVerify = await API.refreshVerify()
            setToken(RTVerify.data.accesstoken, '')
            return { success: true, msg: 'new accesstoken generate' }
        } catch {
            return { success: false, msg: 'refresh token unverify' }
        }
    }
    
    // if(!ATVerify.data.success) {
    //     const RToken = getCookie('refreshtoken')
    //     if(!RToken) return false
    //     const RTVerify = await API.refreshVerify()
    //     if(!RTVerify.data.success) return false
    //     setToken(RTVerify.data.accesstoken, '')

    // }
    // API.tokenVerify()
    //     .catch(error => {
    //         const RToken = getCookie('refreshtoken')
    //         if(!RToken) {
    //             boolV = false
    //             console.log(`catch inner ${boolV}`)
    //         } 
    //         API.refreshVerify()
    //             .then(res => {
    //                 setToken(res.data.accesstoken, '')
    //             })
    //             .catch(error => {
    //                 boolV = false
    //             })
    //     })
    // console.log(`return front ${boolV}`)
}

export { setToken, tokenCheck }