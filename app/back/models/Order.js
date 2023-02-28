const dbo = require('../bin/db/connect')
const OrderStorage = require('./OrderStorage')

class Order {
    constructor(body) {
        this.body = body
    }

    async create(user) {
        const dbConnect = dbo.getDB()
        const body = this.body
        const contents = await OrderStorage.getContents(body, user)
        dbConnect.collection('order').insertOne(contents.order)
        return contents.orderId
    }
}

module.exports = Order