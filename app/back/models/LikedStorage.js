const dbo = require('../bin/db/connect')

class LikedStorage {
    static async getLiked(body) {
        const dbConnect = dbo.getDB()
        const liked = await dbConnect.collection('liked').findOne({ username: body.username, productId: body.id })

        return liked
    }

    static async getList(username) {
        const dbConnect = dbo.getDB()
        const likedList = await dbConnect.collection('liked').find({ username: username }).toArray()

        return likedList
    }
}

module.exports = LikedStorage