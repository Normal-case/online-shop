const jwt = require('jsonwebtoken')

const manager = {
    generateToken: (body, isAccess) => {
        var secret, expiredTime
        if(isAccess) {
            secret = process.env.ACCESSTOKEN_SECRET
            expiredTime = '1h'
        } else {
            secret = process.env.REFRESHTOKEN_SECRET
            expiredTime = '30d'
        }
        return jwt.sign(body, secret, { expiresIn: expiredTime })
    },

    verifyToken: (token, isAccess) => {
        var secret
        if(isAccess) {
            secret = process.env.ACCESSTOKEN_SECRET
        } else {
            secret = process.env.REFRESHTOKEN_SECRET
        }
        return jwt.verify(token, secret)
    }
}

module.exports = {
    manager
}