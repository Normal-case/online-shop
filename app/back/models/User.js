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
                const AToken = Token.manager.generateToken(payload, true)
                const RToken = Token.manager.generateToken(payload, false)
                return { success: true, accesstoken: AToken, refreshtoken: RToken}
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
            const decoded = Token.manager.verifyToken(accesstoken, true)
            return { success: true }
        } catch {
            return { success: false, msg: "Token is expired or invalid token" }
        }
    }

    async register() {
        const body = this.body
        const response = await UserStorage.save(body)
        return response
    }
}

module.exports = User