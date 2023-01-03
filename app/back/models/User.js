const bcrypt = require('bcrypt')

const UserStorage = require('./UserStorage')
const Token = require('../bin/jwt/token')

class User {
    constructor(body) {
        this.body = body
    }

    async login() {
        const body = this.body
        const data = await UserStorage.getUserInfo(body.username)
        if (data) {
            if (bcrypt.compareSync(body.password, data.password)) {
                const payload = { username: body.username }
                return { success: true, accesstoken: Token.manager.generateToken(payload) }
            } else {
                return { success: false, msg: "password is different" }
            }
        } else {
            return { success: false, msg: "username does not exist" }
        }
    }

    accesstoken(token) {
        if(!token) return { success: false, msg: "Token is empty"}
        const accesstoken = token.split(' ')[1]
        try {
            const decoded = Token.manager.verifyToken(accesstoken)
            return { success: true }
        } catch {
            return { success: false, msg: "Token is expired" }
        }
    }

    async register() {
        const body = this.body
        const response = await UserStorage.save(body)
        return response
    }
}

module.exports = User