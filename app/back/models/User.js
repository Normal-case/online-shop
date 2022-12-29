const UserStorage = require('./UserStorage')
const dbo = require('../bin/db/connect')

class User {
    constructor(body) {
        this.body = body
    }

    async login() {
        const body = this.body
        const data = await UserStorage.getUserInfo(body.username)
        if (data) {
            if (data.password == body.password) {
                return { success: true }
            } else {
                return { success: false, msg: "password is different" }
            }
        } else {
            return { success: false, msg: "username does not exist" }
        }
    }

    async register() {
        const body = this.body
        const response = await UserStorage.save(body)
        return response
    }
}

module.exports = User