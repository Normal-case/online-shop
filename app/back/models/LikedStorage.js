const dbo = require('../bin/db/connect')

class LikedStorage {
    static async getLiked(body) {
        const dbConnect = dbo.getDB()
        const liked = await dbConnect.collection('liked').findOne({ username: body.username, productId: body.id })

        return liked
    }
}

module.exports = LikedStorage