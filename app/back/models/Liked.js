const dbo = require('../bin/db/connect')

class Liked {
    constructor(body) {
        this.body = body
    }

    async create() {
        const dbConnect = dbo.getDB()
        const body = this.body
        const liked = await dbConnect.collection('liked').findOne({ username: body.username, productId: body.productId })
        if(!liked) {
            dbConnect.collection('liked').insertOne(body)
        }
    }
}

module.exports = Liked