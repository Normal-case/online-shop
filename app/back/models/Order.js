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

    async status() {
        const idArr = this.body.updateId
        const status = this.body.status

        const dbConnect = dbo.getDB()
        for(var i=0;i<idArr.length;i++) {
            const oId = ObjectID(idArr[i])
            dbConnect.collection('order').updateOne(
                { _id: oId },
                { $set: { status: status }},
                { upsert: true }
            )
        }
    }
}

module.exports = Order