const dbo = require('../bin/db/connect')

class UserStorage {
    static getUserInfo(username) {
        const dbConnect = dbo.getDB()
        const user = dbConnect.collection('user').findOne({ username: username })
        return user
    }
}

module.exports = UserStorage