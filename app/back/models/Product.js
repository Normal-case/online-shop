const dbo = require('../bin/db/connect')
const { ObjectId } = require('mongodb')
const domain = process.env.SERVER_DOMAIN

class Product {
    create(files, body) {
        const dbConnect = dbo.getDB()
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
        dbConnect.collection('product').insertOne(info)

        for(var i=0;i<files.length;i++) {
            dbConnect.collection('productImage').insertOne({
                url: `${domain}/profile/${body.productName}_${i}.jpg`,
                productID: id
            })
        }
    }
}

module.exports = Product