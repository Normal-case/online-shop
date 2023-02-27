const dbo = require('../bin/db/connect')

class WishList {
    constructor(body) {
        this.body = body
    }

    async create() {
        const dbConnect = dbo.getDB()
        const body = this.body
        const wish = await dbConnect.collection('wishList').findOne({ username: body.username, productId: body.productId})
        if(!wish) {
            dbConnect.collection('wishList').insertOne(body)
        }
    }

    delete() {
        const dbConnect = dbo.getDB()
        const body = this.body
        dbConnect.collection('wishList').deleteOne({ username: body.username, productId: body.productId})
    }
}

module.exports = WishList