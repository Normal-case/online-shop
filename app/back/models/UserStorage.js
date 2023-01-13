const bcrypt = require('bcrypt')
const rounds = 10 // hash amount
const dbo = require('../bin/db/connect') // call database
const refreshExpiredTime = 1000 * 60 * 60 * 24 * 30 * 1

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

    static saveRefresh(username, refreshtoken) {
        const dbConnect = dbo.getDB()
        const current = new Date()
        const body = {
            username: username,
            refresh: refreshtoken,
            expiredAt: new Date(current.getTime() + refreshExpiredTime)
        }
        dbConnect.collection('refresh').findOne({ username: username }, (err, result) => {
            if(err) { console.log (err)}
            
            if(result) {
                // refresh token is already exist
                dbConnect.collection('refresh').deleteOne({ username: username })
            }
            dbConnect.collection('refresh').insertOne(body)
        })
    }
}

module.exports = UserStorage