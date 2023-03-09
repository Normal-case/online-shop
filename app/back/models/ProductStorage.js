const { ObjectId } = require('mongodb')
const dbo = require('../bin/db/connect')

class ProductStorage {
    static createProductInfo(body, productImage, id, username) {
        const info = {
            name: body.productName,
            category: body.productCategory,
            price: Number(body.productPrice),
            description: body.productDesc,
            purchase: 0,
            ratingSum: 0,
            reviews: 0,
            image: productImage,
            posted: username,
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


    static async getProductDetail(id) {
        const dbConnect = dbo.getDB()
        var oID = new ObjectId(id)
        const product = await dbConnect.collection('product').findOne({_id: oID})
        return product
    }
}

module.exports = ProductStorage