const { ObjectId } = require('mongodb')

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
}

module.exports = ProductStorage