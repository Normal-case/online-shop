const bcrypt = require('bcrypt')
const rounds = 10
const dbo = require('../bin/db/connect')

class UserStorage {
    static getUserInfo(username) {
        const dbConnect = dbo.getDB()
        const user = dbConnect.collection('user').findOne({ username: username })
        return user
    }

    static async save(userInfo) {
        const dbConnect = dbo.getDB()
        const user = await this.getUserInfo(userInfo.username)
        if(user) {
            return { success: false, msg: "username is already exist" }
        } else {
            const encryptedPs = bcrypt.hashSync(userInfo.password, rounds)
            const body = {
                name: userInfo.name,
                username: userInfo.username,
                password: encryptedPs
            }
            dbConnect.collection('user').insertOne(body)
            return { success: true }
        }
    }
}

module.exports = UserStorage