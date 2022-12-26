const dbo = require('../bin/db/connect')

class UserStorage {
    static getUserInfo(username) {
        const dbConnect = dbo.getDB()
        const data = dbConnect.collection('user').findOne({ username: username })
        return data
    }
}

module.exports = UserStorage