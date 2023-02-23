const dbo = require('../bin/db/connect')
const { ObjectId } = require('mongodb')
const domain = process.env.SERVER_DOMAIN
const ProductStorage = require('./ProductStorage')

class Product {
    create(files, body, username) {
        const dbConnect = dbo.getDB()
        const id = ObjectId()
        let productImage = []
        for(var i=0;i<files.length;i++) {
            productImage.push(`${domain}/product/${id}_${i}.jpg`)
        }

        const info = ProductStorage.createProductInfo(body, productImage, id, username)
        dbConnect.collection('product').insertOne(info)

        return id
    }
}

module.exports = Product