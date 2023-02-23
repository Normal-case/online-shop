import axios from 'axios'
import { deleteCookie, getCookie } from 'cookies-next'

const domain: string = "http://localhost:8000"

export default class API {
    static tokenVerify() {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.get(`${domain}/user/auth`, {
            headers: { 'access': 'Bearer ' + accesstoken, 'refresh': 'Bearer ' + refreshtoken }
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

    static profile() {
        const user = getCookie('user')
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.get(`${domain}/user/profile`, {
            headers: {
                'user': user,
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }

    static profileUpdate(body: any) {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.post(`${domain}/profile`, body, {
            headers: {
                "Content-Type": "multipart/form-data",
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }

    static productCreate(body: any) {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.post(`${domain}/product`, body, {
            headers: {
                "Content-Type": "multipart/form-data",
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }

    static productGet() {
        return axios.get(`${domain}/product`)
    }

    static productDetail(id: string) {
        return axios.get(`${domain}/product/${id}`)
    }
}