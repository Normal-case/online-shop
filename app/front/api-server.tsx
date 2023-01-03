import axios from 'axios'

const domain: string = "http://localhost:8000"
export default class API {
    static loginGet() {
        return axios.get(`${domain}/login`)
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