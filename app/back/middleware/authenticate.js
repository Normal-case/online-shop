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

const logout = ((req, res, next) => {
    if(req.headers.access && req.headers.refresh) {
        console.log('1')
        const AToken = req.headers.access.split(' ')[1]
        const RToken = req.headers.refresh.split(' ')[1]
        jwt.verify(AToken, process.env.ACCESSTOKEN_SECRET, (err, decoded) => {
            if(err) {
                jwt.verify(RToken, process.env.REFRESHTOKEN_SECRET, async (err, decoded) => {
                    if(err) {
                        return res.status(400).json({ success: false, msg: 'token is unverify'})
                    }
                    
                    if(decoded) {
                        const dbConnect = dbo.getDB()
                        const user = await dbConnect.collection('refresh').findOne({ refresh: RToken })
                        if(user) {
                            dbConnect.collection('refresh').deleteOne({ refresh: RToken })
                            next()
                        } else {
                            return res.status(400).json({ success: false, msg: 'token is unverify'})
                        } 
                    }
                })
            }
            
            if(decoded) {
                const dbConnect = dbo.getDB()
                dbConnect.collection('refresh').deleteOne({ username: decoded.username })
                next()
            }
        })
    } else if (!req.headers.access && req.headers.refresh) {
        console.log('2')
        const RToken = req.headers.refresh.split(' ')[1]
        jwt.verify(RToken, process.env.REFRESHTOKEN_SECRET, async (err, decoded) => {
            if(err) return res.status(400).json({ success: false, msg: 'token is unverify'})

            if(decoded) {
                const dbConnect = dbo.getDB()
                const user = await dbConnect.collection('refresh').findOne({ refresh: RToken })
                if(user) {
                    dbConnect.collection('refresh').deleteOne({ refresh: RToken })
                    next()
                } else {
                    return res.status(400).json({ success: false, msg: 'token is unverify'})
                }
            }
        })
    } else if (req.headers.access && !req.headers.refresh) {
        console.log('3')
        const AToken = req.headers.access.split(' ')[1]
        jwt.verify(AToken, process.env.ACCESSTOKEN_SECRET, (err, decoded) => {
            if(err) return res.status(400).json({ success: false, msg: 'token is unverify'})

            if(decoded) {
                const dbConnect = dbo.getDB()
                dbConnect.collection('refresh').deleteOne({ username: decoded.username })
                next()
            }
        })
    } else {
        console.log('4')
        return res.status(400).json({ success: false, msg: 'token is empty'})
    }
})

module.exports = {
    authenticate,
    refreshAuth,
    logout
}