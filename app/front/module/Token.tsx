import axios from 'axios'
import { setCookie } from 'cookies-next'

const setToken = (accesstoken: string) => {
    axios.defaults.headers.Authorization = 'Bearer ' + accesstoken
    setCookie('accesstoken', accesstoken)
}

export {setToken}