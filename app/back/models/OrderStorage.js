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

    static async getOrderList(username, status) {
        const dbConnect = dbo.getDB()
        const orderList = await dbConnect.collection('order').find({
            username: username,
            status: status
        }).toArray()
        //console.log(orderList)
        var orderArr = []
        for(var i=0;i<orderList.length;i++) {
            var price = 0
            var imageArr = []
            for(var j=0;j<orderList[i].orderDId.length;j++) {
                const detail = await dbConnect.collection('orderDetail').findOne({ _id: orderList[i].orderDId[j]})
                price = price + detail.totalPrice
                imageArr.push(detail.image)
            }
            orderList[i].totalPrice = price
            orderList[i].imageList = imageArr
            orderList[i].createAt = new Date(orderList[i].createAt.getTime() + 1000 * 60 * 60 * 9)
            orderArr.push(orderList[i])
        }
        // console.log(orderArr)
        return orderArr
    }
}

module.exports = OrderStorage