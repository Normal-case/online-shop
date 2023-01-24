import axios from 'axios'
import { deleteCookie, getCookie } from 'cookies-next'

const domain: string = "http://localhost:8000"
export default class API {
    static tokenVerify() {
        const accesstoken = getCookie('accesstoken')
        return axios.get(`${domain}/user/auth`, {
            headers: { 'Authorization': 'Bearer ' + accesstoken }
        })
    }

    static refreshVerify() {
        const refreshtoken = getCookie('refreshtoken')
        return axios.get(`${domain}/user/auth/refresh`, {
            headers: { 'Authorization': 'Bearer ' + refreshtoken }
        })
    }

    static loginPost(body: Object) {
        return axios.post(`${domain}/login`, body, {
            headers: { "Content-Type": "application/json" }
        })
    }

    static registerPost(body: Object) {
        return axios.post(`${domain}/register`, body)
    }

    static logout() {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        deleteCookie('accesstoken')
        deleteCookie('refreshtoken')
        return axios.get(`${domain}/user/login`, {
            headers: { 'access': 'Bearer ' + accesstoken, 'refresh': 'Bearer ' + refreshtoken}
        })
    }
}