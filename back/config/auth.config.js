require('dotenv').config()

module.exports = {
    secret: process.env.JSONWEBTOKEN_SECRET
}