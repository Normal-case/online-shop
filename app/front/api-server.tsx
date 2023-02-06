import axios from 'axios'
import { deleteCookie, getCookie } from 'cookies-next'

const domain: string = "http://localhost:8000"
const accesstoken = getCookie('accesstoken')
const refreshtoken = getCookie('refreshtoken')
export default class API {
    static tokenVerify() {
        return axios.get(`${domain}/user/auth`, {
            headers: { 'access': 'Bearer ' + accesstoken, 'refresh': 'Bearer ' + refreshtoken }
        })
    }

    static refreshVerify() {
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
        deleteCookie('accesstoken')
        deleteCookie('refreshtoken')
        return axios.get(`${domain}/user/login`, {
            headers: { 'access': 'Bearer ' + accesstoken, 'refresh': 'Bearer ' + refreshtoken}
        })
    }

    static profile() {
        const user = getCookie('user')
        return axios.get(`${domain}/user/profile`, {
            headers: {
                'user': user,
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }

    static profileUpdate(body: any) {
        return axios.post(`${domain}/profile`, body, {
            headers: { "Content-Type": "multipart/form-data" }
        })
    }
}