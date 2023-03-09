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

    static wishListPost(body: Object) {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.post(`${domain}/wishList`, body, {
            headers: {
                'Content-Type': 'application/json',
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }

    static likedPost(body: Object) {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.post(`${domain}/liked`, body, {
            headers: {
                'Content-Type': 'application/json',
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }

    static likedGet(body: Object) {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.post(`${domain}/liked/get`, body, {
            headers: {
                'Content-Type': 'application/json',
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }

    static likedDelete(data: Object) {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.delete(`${domain}/liked`, { data: data, headers: {
            'Content-Type': 'application/json',
            'access': 'Bearer ' + accesstoken,
            'refresh': 'Bearer ' + refreshtoken
        } })
    }

    static wishListDelete(data: Object) {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.delete(`${domain}/wishList`, { data: data, headers: {
            'Content-Type': 'application/json',
            'access': 'Bearer ' + accesstoken,
            'refresh': 'Bearer ' + refreshtoken
        } })
    }

    static cartLikedGet() {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.get(`${domain}/wishList`, {
            headers: {
                'Content-Type': 'application/json',
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }

    static order(body: Object) {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.post(`${domain}/order`, body, {
            headers: {
                'Content-Type': 'application/json',
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }

    static getOrder(id: string) {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.get(`${domain}/order/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }

    static ordering(body: Object) {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.put(`${domain}/order`, body, {
            headers: {
                'Content-Type': 'application/json',
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }

    static getOrderAllList(status: string) {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.get(`${domain}/admin/order/list/${status}`, {
            headers: {
                'Content-Type': 'application/json',
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }

    static getOrderUser() {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.get(`${domain}/user/order`, {
            headers: {
                'Content-Type': 'application/json',
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }

    static updateOrder(body: Object) {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.put(`${domain}/admin/order/status`, body, {
            headers: {
                'Content-Type': 'application/json',
                'access': 'Bearer ' +  accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        }) 
    }

    static createReview(body) {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.post(`${domain}/review`, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }

    static getReview(id: string) {
        const accesstoken = getCookie('accesstoken')
        const refreshtoken = getCookie('refreshtoken')
        return axios.get(`${domain}/review/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'access': 'Bearer ' + accesstoken,
                'refresh': 'Bearer ' + refreshtoken
            }
        })
    }
}