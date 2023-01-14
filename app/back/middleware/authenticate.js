const jwt = require('jsonwebtoken')
const dbo = require('../bin/db/connect')
const errorMessage = 'Auth Error from authenticate'

// authenticate middleware
const authenticate = ((req, res, next) => {
    if(req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.ACCESSTOKEN_SECRET, (err) => {
            if (err) {
                res.status(401).json({ success: false, error: errorMessage })
            } else {
                next()
            }
        })
    } else {
        res.status(401).json({ success: false, error: errorMessage })
    }
})

const refreshAuth = ((req, res, next) => {
    if(req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        console.log(token)
        jwt.verify(token, process.env.REFRESHTOKEN_SECRET, async (err) => {
            if(err) {
                console.log('jwt unverify')
                res.status(401).json({ success: false, error: errorMessage })
            } else {
                const dbConnect = dbo.getDB()
                const user = await dbConnect.collection('refresh').findOne({ refresh: token })
                if(user) {
                    console.log('success')
                    req.username = user.username
                    next()
                } else {
                    console.log('db not find')
                    res.status(401).json({ success: false, error: errorMessage })
                }
            }
            
        })
    } else {
        console.log('empty')
        res.status(401).json({ success: false, error: errorMessage })
    }
})

module.exports = {
    authenticate,
    refreshAuth
}