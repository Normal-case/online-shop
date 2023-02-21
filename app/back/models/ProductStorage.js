const { ObjectId } = require('mongodb')
const dbo = require('../bin/db/connect')

class ProductStorage {
    static createProductInfo(body) {
        const id = ObjectId()
        const info = {
            name: body.productName,
            category: body.productCategory,
            price: Number(body.productPrice),
            description: body.productDesc,
            purchase: 0,
            reviews: 0,
            createAt: new Date(),
            updateAt: new Date(),
            _id: id
        }
        return info
    }

    static async getProduct() {
        const dbConnect = dbo.getDB()
        const productList = await dbConnect.collection('product').find({}).toArray()
        return productList
    }
}

module.exports = ProductStorage