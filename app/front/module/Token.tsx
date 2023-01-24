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
        if(!RToken) {
            return { success: false, msg: 'refresh token empty' }
        }

        try {
            const RTVerify = await API.refreshVerify()
            setToken(RTVerify.data.accesstoken, '')
            return { success: true, msg: 'new accesstoken generate' }
        } catch {
            return { success: false, msg: 'refresh token unverify' }
        }
    }
}

export { setToken, tokenCheck }