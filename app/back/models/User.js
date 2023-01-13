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
                // refresh token database save
                UserStorage.saveRefresh(body.username, RToken)
                return { success: true, accesstoken: AToken, refreshtoken: RToken}
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