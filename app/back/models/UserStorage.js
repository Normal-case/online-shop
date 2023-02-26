const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const rounds = 10 // hash amount
const dbo = require('../bin/db/connect') // call database
const refreshExpiredTime = 1000 * 60 * 60 * 24 * 30 * 1
const domain = process.env.SERVER_DOMAIN

class UserStorage {
    static getUserInfo(username) {
        const dbConnect = dbo.getDB()
        const user = dbConnect.collection('user').findOne({ username: username })
        return user
    }

    static async save(userInfo) {
        const dbConnect = dbo.getDB()
        const user = await this.getUserInfo(userInfo.username)
        if(user) {
            return { success: false, msg: "username is already exist" }
        } else {
            const encryptedPs = bcrypt.hashSync(userInfo.password, rounds)
            const id = ObjectId()
            const body = {
                name: userInfo.name,
                username: userInfo.username,
                password: encryptedPs,
                authority: 'user', // default is user.
                _id: id
            }
            const profile = {
                username: userInfo.username,
                name: userInfo.name,
                point: 0,
                zoneCode: '',
                address: '',
                detail: '',
                pImage: `${domain}/profile/profile.png`,
                authority: 'user', // default is user
                _id: id
            }
            dbConnect.collection('user').insertOne(body)
            dbConnect.collection('profile').insertOne(profile)
            return { success: true }
        }
    }

    static saveRefresh(username, refreshtoken) {
        const dbConnect = dbo.getDB()
        const current = new Date()
        const body = {
            username: username,
            refresh: refreshtoken,
            expiredAt: new Date(current.getTime() + refreshExpiredTime)
        }
        dbConnect.collection('refresh').findOne({ username: username }, (err, result) => {
            if(err) { console.log (err)}
            
            if(result) {
                // refresh token is already exist
                dbConnect.collection('refresh').deleteOne({ username: username })
            }
            dbConnect.collection('refresh').insertOne(body)
        })
    }

    static profileGet(username) {
        const dbConnect = dbo.getDB()
        const profile = dbConnect.collection('profile').findOne({ username: username })
        return profile
    }

    static async profileUpdate(file, body) {
        /* profile update function */
        const dbConnect = dbo.getDB()

        // find original profile
        const profile = await dbConnect.collection('profile').findOne({ username: body.username })
        var imagePath = profile.pImage
        if(file) {
            imagePath = `${domain}/profile/${profile.username}Profile.jpg`
        }

        // update profile using orm
        dbConnect.collection('profile').update(
            { username: body.username },
            { $set: {
                name: body.nickname,
                zoneCode: body.zoneCode,
                address: body.address,
                detail: body.detail,
                pImage: imagePath
            }},
            { upsert: true } // 변경사항이 있으면 변경
        )
        return profile
    }

    static async wishListCreate(body) {
        const dbConnect = dbo.getDB()

        const wish = await dbConnect.collection('wishList').findOne({ username: body.username, productId: body.productId})
        if(!wish) {
            dbConnect.collection('wishList').insertOne(body)
        }
    }
}

module.exports = UserStorage