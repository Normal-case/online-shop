import axios from 'axios'
import { getCookie } from 'cookies-next'

const domain: string = "http://localhost:8000"
export default class API {
    static tokenVerify() {
        const accesstoken = getCookie('accesstoken')
        return axios.get(`${domain}/user/auth`, {
            headers: { 'Authorization': 'Bearer ' + accesstoken }
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
}