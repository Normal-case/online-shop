const jwt = require('jsonwebtoken')

const expireTime = '1h'

const manager = {
    generateToken: (body) => {
        return jwt.sign(body, process.env.ACCESSTOKEN_SECRET, { expiresIn: expireTime })
    },

    verifyToken: (token) => {
        return jwt.verify(token, process.env.ACCESSTOKEN_SECRET)
    }
}

module.exports = {
    manager
}