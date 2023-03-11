const dbo = require('../bin/db/connect')
const { ObjectId } = require('mongodb')
const domain = process.env.SERVER_DOMAIN
const ProductStorage = require('./ProductStorage')

class Product {
    constructor(body) {
        this.body = body
    }

    create(files, user) {
        const dbConnect = dbo.getDB()
        const id = ObjectId()
        const body = this.body
        let productImage = []
        for(var i=0;i<files.length;i++) {
            productImage.push(`${domain}/product/${id}_${i}.jpg`)
        }

        const info = ProductStorage.createProductInfo(body, productImage, id, user)
        dbConnect.collection('product').insertOne(info)

        return id
    }

    update(files) {
        const dbConnect = dbo.getDB()
        const body = this.body
        let productImage = []

        if(files) {
            for(let i=0;i<files.length;i++) {
                productImage.push(`${domain}/product/${body.id}_${i}.jpg`)
            }
        }
        
        dbConnect.collection('product').updateOne(
            { _id: ObjectId(body.id) },
            { $set: {
                name: body.productName,
                category: body.productCategory,
                price: Number(body.productPrice),
                description: body.productDesc,
                image: productImage,
                updateAt: new Date()
            }},
            { upsert: true }
        )
    }
}

module.exports = Product