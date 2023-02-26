const dbo = require('../bin/db/connect')
const LikedStorage = require('./LikedStorage')

class WishListStorage {
    static async getList(username) {
        const dbConnect = dbo.getDB()
        const wishList = await dbConnect.collection('wishList').find({ username: username }).toArray()
        const likedList = await LikedStorage.getList(username)
        return { wishList, likedList }
    }
}

module.exports = WishListStorage