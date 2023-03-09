const { ObjectId } = require('mongodb')
const ReviewStorage = require('./ReviewStorage')
const dbo = require('../bin/db/connect')
const domain = process.env.SERVER_DOMAIN

class Review {
    constructor(body) {
        this.body = body
    }

    async create(files, username) {
        const body = this.body
        const dbConnect = dbo.getDB()
        const id = ObjectId()
        const pId = ObjectId(body.productId)
        // 이미 작성한 리뷰가 있을 경우
        const review = await dbConnect.collection('review').findOne({
            username: username,
            productId: body.productId
        })
        if(review) return { success: false, type: 'exist' }
        

        // 해당 상품을 구매하지 않은 경우
        const buy = await dbConnect.collection('productUser').findOne({
            username: username,
            productId: pId
        })
        if(!buy) return { success: false, type: 'buy' }

        let reviewImage = []
        for(let i=0;i<files.length;i++) {
            reviewImage.push(`${domain}/review/${id}_${i}.jpg`)
        }
        const payload = await ReviewStorage.createReviewInfo(body, reviewImage, id, username)
        dbConnect.collection('review').insertOne(payload)

        // 리뷰 평점 상품에 반영
        dbConnect.collection('product').updateOne(
            { _id: pId },
            { $inc : {
                ratingSum: payload.rating,
                reviews: 1
            }}
        )
        
        return { success: true, id: id }
    }
}

module.exports = Review