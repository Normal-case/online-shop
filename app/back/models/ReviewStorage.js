const { ObjectId } = require('mongodb')
const dbo = require('../bin/db/connect')

class ReviewStorage {
    static async createReviewInfo(body, reviewImage, id, username) {
        const dbConnect = dbo.getDB()
        const profile = await dbConnect.collection('profile').findOne({
            username: username
        })
        const payload = {
            productId: body.productId,
            username: username,
            rating: Number(body.rating),
            contents: body.contents,
            image: reviewImage,
            nickname: profile.name,
            pImage: profile.pImage,
            _id: id
        }

        return payload
    }

    static async getReview(id) {
        const dbConnect = dbo.getDB()
        const review = await dbConnect.collection('review').find({
            productId: id
        }).toArray()
        return review
    }
}

module.exports = ReviewStorage