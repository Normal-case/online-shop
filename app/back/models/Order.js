const { ObjectID } = require('bson')
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

    async update() {
        const body = this.body
        const data = await OrderStorage.getOrderOnly(body.id)
        if(!data) {
            return false
        }
        OrderStorage.orderUpdate(data, body)
        return true
    }
}

module.exports = Order