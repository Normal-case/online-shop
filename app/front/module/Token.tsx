import axios from 'axios'
import { setCookie } from 'cookies-next'

const setToken = (accesstoken: string) => {
    axios.defaults.headers.Authoriztion = 'Bearer ' + accesstoken
    setCookie('accesstoken', accesstoken)
}

export {setToken}