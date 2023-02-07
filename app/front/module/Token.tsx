import axios from 'axios'
import { setCookie, getCookie } from 'cookies-next'

import API from '../api-server'

const setToken = (accesstoken: string, refreshtoken: string = '', user: string = '') => {
    axios.defaults.headers.Authorization = 'Bearer ' + accesstoken
    setCookie('accesstoken', accesstoken)
    if(refreshtoken) {
        setCookie('refreshtoken', refreshtoken)
    }

    if(user) {
        setCookie('user', user)
    }
}


export { setToken }