const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
            if (bcrypt.compareSync(body.password, data.password)) {
                return { success: true, accesstoken: jwt.sign({ username: body.username }, process.env.ACCESSTOKEN_SECRET, { expiresIn: 60 * 60 }) }
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