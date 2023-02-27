const dbo = require('../bin/db/connect')
const { ObjectId } = require('mongodb')

class OrderStorage {
    static async getContents(body, user) {
        const dbConnect = dbo.getDB()
        const profile = await dbConnect.collection('profile').findOne({username: user.username})

        const pId = ObjectId()
        const idArr = await this.saveOrderDetail(body, pId)
        const contents = {
            username: user.username,
            nickname: user.name,
            email: '',
            memo: '',
            status: 'default',
            zoneCode: profile.zoneCode,
            address: profile.address,
            detail: profile.detail,
            createAt: new Date(),
            orderDId: idArr,
            _id: pId
        }

        return contents
    }

    static async saveOrderDetail(body, pId) {
        const dbConnect = dbo.getDB()
        const data = body.data
        var idArr = []
        for(var i=0;i<data.length;i++) {
            const id = new ObjectId(data[i].productId)
            const dId = new ObjectId()
            idArr.push(dId)
            const product = await dbConnect.collection('product').findOne({_id: id})
            const payload = {
                orderId: pId,
                productName: product.name,
                amount: data[i].amount,
                price: product.price,
                totalPrice: product.price * data[i].amount,
                productId: product._id,
                _id: dId
            }
            dbConnect.collection('orderDetail').insertOne(payload)
        }

        return idArr
    }
}

module.exports = OrderStorage