const dbo = require('../bin/db/connect')

class ReviewStorage {
    static async createReviewInfo(body, reviewImage, id, username) {
        const payload = {
            productId: body.productId,
            username: username,
            rating: Number(body.rating),
            contents: body.contents,
            image: reviewImage,
            _id: id
        }

        return payload
    }

    static async getReview(id) {
        const dbConnect = dbo.getDB()
        const review = await dbConnect.collection('review').find({
            productId: id
        }).toArray()

        for(let i=0;i<review.length;i++) {
            const username = review[i].username
            const profile = await dbConnect.collection('profile').findOne({ username: username })

            review[i].nickname = profile.name
            review[i].pImage = profile.pImage
        }

        return review
    }
}

module.exports = ReviewStorage