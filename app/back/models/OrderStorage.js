const dbo = require('../bin/db/connect')
const { ObjectId } = require('mongodb')
const orderExpiredTime = 1000 * 60 * 60 // 1 hour

class OrderStorage {
    static async getContents(body, user) {
        const dbConnect = dbo.getDB()
        const profile = await dbConnect.collection('profile').findOne({username: user.username})

        const pId = ObjectId()
        const current = new Date()
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
            createAt: current,
            orderDId: idArr,
            expiredAt: new Date(current.getTime() + orderExpiredTime),
            _id: pId
        }

        const data = {
            order: contents,
            orderId: pId
        }

        return data
    }

    static async saveOrderDetail(body, pId) {
        const dbConnect = dbo.getDB()
        const data = body.data
        var idArr = []
        for(var i=0;i<data.length;i++) {
            const id = new ObjectId(data[i].productId)
            const dId = new ObjectId()
            const current = new Date()
            idArr.push(dId)
            const product = await dbConnect.collection('product').findOne({_id: id})
            const payload = {
                orderId: pId,
                productName: product.name,
                productCategory: product.category,
                amount: data[i].amount,
                price: product.price,
                totalPrice: product.price * data[i].amount,
                productId: product._id,
                expiredAt: new Date(current.getTime() + orderExpiredTime),
                image: product.image[0],
                _id: dId
            }
            dbConnect.collection('orderDetail').insertOne(payload)
        }

        return idArr
    }

    static async getOrder(id) {
        const dbConnect = dbo.getDB()
        const oId = ObjectId(id)
        const order = await dbConnect.collection('order').findOne({_id: oId})
        var data = {}
        if(order) {
            const orderDetail = await dbConnect.collection('orderDetail').find({ orderId: order._id }).toArray()
            data = {
                load: true,
                order,
                detail: orderDetail
            }
        } else {
            data = {
                load: false
            }
        }
        
        return data
    }
}

module.exports = OrderStorage