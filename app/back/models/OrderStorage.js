const dbo = require('../bin/db/connect')
const { ObjectId } = require('mongodb')
const orderExpiredTime = 1000 * 60 * 60 // 1 hour
const paiedOrderExpiredTime = 1000 * 60 * 60 * 24 * 30 * 12 * 100 // 100 years

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

    static async getOrderOnly(id) {
        const dbConnect = dbo.getDB()
        const oId = ObjectId(id)
        const order = await dbConnect.collection('order').findOne({_id: oId})
        return order
    }
    
    static async orderUpdate(data, body) {
        const dbConnect = dbo.getDB()
        const oId = ObjectId(data._id)
        const current = new Date()
        dbConnect.collection('order').updateOne(
            { _id: oId },
            { $set: {
                nickname: body.nickname,
                email: body.email,
                memo: body.memo,
                status: 'paied',
                zoneCode: body.zoneCode,
                address: body.address,
                detail: body.detail,
                phone: body.phone,
                expiredAt: new Date(current.getTime() + paiedOrderExpiredTime)
            }},
            { upsert: true }
        )

        for(var i=0;i<data.orderDId.length;i++) {
            dbConnect.collection('orderDetail').updateOne(
                { _id: data.orderDId[i] },
                { $set: {
                    expiredAt: new Date(current.getTime() + paiedOrderExpiredTime)
                }}
            )
        }
    }

    static async getOrderList(username) {
        const paiedArr = await this.orderStatus('paied', username)
        const preparingArr = await this.orderStatus('preparing', username)
        const departArr = await this.orderStatus('depart', username)
        const shippingArr = await this.orderStatus('shipping', username)
        const deliveredArr = await this.orderStatus('delivered', username)

        return { paiedArr, preparingArr, departArr, shippingArr, deliveredArr }
    }

    static async orderStatus(status, username = undefined) {
        const dbConnect = dbo.getDB()
        var orderArr
        if(username) {
            orderArr = await dbConnect.collection('order').find({
                username: username,
                status: status
            }).toArray()
        } else {
            orderArr = await dbConnect.collection('order').find({
                status: status
            }).toArray()
        }
        
        var orderList = []
        for(var i=0;i<orderArr.length;i++) {
            var price = 0
            var imageArr = []
            for(var j=0;j<orderArr[i].orderDId.length;j++) {
                const detail = await dbConnect.collection('orderDetail').findOne({
                    _id: orderArr[i].orderDId[j]
                })
                price = price + detail.totalPrice
                imageArr.push(detail.image)
            }
            orderArr[i].totalPrice = price
            orderArr[i].imageList = imageArr
            orderArr[i].createAt = new Date(orderArr[i].createAt.getTime() + 1000 * 60 * 60 * 9)
            orderList.push(orderArr[i])
        }

        return orderList
    }

    static async getOrderAllList(status) {
        const orderArr = await this.orderStatus(status)
        return orderArr
    }
}

module.exports = OrderStorage