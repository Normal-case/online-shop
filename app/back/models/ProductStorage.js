const { ObjectId } = require('mongodb')
const dbo = require('../bin/db/connect')

class ProductStorage {
    static createProductInfo(body, productImage, id, user) {
        const info = {
            name: body.productName,
            category: body.productCategory,
            price: Number(body.productPrice),
            description: body.productDesc,
            purchase: 0,
            ratingSum: 0,
            reviews: 0,
            image: productImage,
            posted: user.name,
            postedUsername: user.username,
            createAt: new Date(),
            updateAt: new Date(),
            _id: id
        }
        return info 
    }

    static async getProduct(filter) {
        const dbConnect = dbo.getDB()
        var productList 
        if(filter === 'top') {
            productList = await dbConnect.collection('product').find({
                $or: [
                    { category: 'outer' },
                    { category: 'knit' },
                    { category: 'tShrit' },
                    { category: 'blouse' }
                ]
            }).toArray()
        } else if(filter === 'bottom') {
            productList = await dbConnect.collection('product').find({
                $or: [
                    { category: 'skirt' },
                    { category: 'pants' }
                ]
            }).toArray()
        } else if(filter === 'onePiece') {
            productList = await dbConnect.collection('product').find({
                category: 'onePiece'
            }).toArray()
        } else if(filter === 'hot') {
            productList = await dbConnect.collection('product').find({})
                .sort({purchase: -1}).toArray()
        } else {
            productList = await dbConnect.collection('product').find({})
                .sort({ratingSum: -1}).limit(10).toArray()
        }
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