import axios from 'axios'
import { setCookie } from 'cookies-next'

const setToken = (accesstoken: string, refreshtoken: string) => {
    axios.defaults.headers.Authorization = 'Bearer ' + accesstoken
    setCookie('accesstoken', accesstoken)
    if(refreshtoken) {
        setCookie('refreshtoken', refreshtoken)
    }
}

export {setToken}