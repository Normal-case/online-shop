const jwt = require('jsonwebtoken')
const dbo = require('../bin/db/connect')
const errorMessage = 'Auth Error from authenticate'
const Token = require('../bin/jwt/token')

// authenticate middleware
const authenticate = ((req, res, next) => {
    if(req.headers.access && req.headers.refresh) {
        console.log('access and refresh')
        const AToken = req.headers.access.split(' ')[1]
        const RToken = req.headers.refresh.split(' ')[1]
        jwt.verify(AToken, process.env.ACCESSTOKEN_SECRET, (err, decoded) => {
            if(err) {
                jwt.verify(RToken, process.env.REFRESHTOKEN_SECRET, async (err, decoded) => {
                    if(err) {
                        console.log('both unverify')
                        return res.status(400).json({ success: false, msg: 'token is unverify' })
                    }

                    if(decoded) {
                        const dbConnect = dbo.getDB()
                        const user = await dbConnect.collection('refresh').findOne({ refresh: RToken })
                        // access token expired
                        // if middleware send status 200 I couldn't use next() so I have to fix it
                        if(user.username === decoded.username) {
                            const AToken = Token.manager.generateToken({ username: user.username }, true)
                            req.access = AToken
                            next()
                        } else {
                            console.log('no db')
                            return res.status(400).json({ success: false, msg: 'token is unverify' })
                        }
                    }
                })
            }

            if(decoded) {
                console.log('next!!')
                next()
            }
        })
    } else if (!req.headers.access && req.headers.refresh) {
        console.log('not access and refresh')
        const RToken = req.headers.refresh.split(' ')[1]
        jwt.verify(RToken, process.env.REFRESHTOKEN_SECRET, async (err, decoded) => {
            if(err) return res.status(400).json({ success: false, msg: 'token is unverify' })

            if(decoded) {
                const dbConnect = dbo.getDB()
                const user = await dbConnect.collection('refresh').findOne({ refresh: RToken })
                if(user.username === decoded.username) {
                    const AToken = Token.manager.generateToken({ username: user.username }, true)
                    req.access = AToken
                    next()
                } else {
                    return res.status(400).json({ success: false, msg: 'token is unverify' })
                }
            }
        })
    } else if (req.headers.access && !req.headers.refresh) {
        console.log('access and not refresh')
        const AToken = req.headers.access.split(' ')[1]
        jwt.verify(AToken, process.env.ACCESSTOKEN_SECRET, (err, decoded) => {
            if(err) return res.status(400).json({ succses: false, msg: 'token is unverify' })

            if(decoded) {
                next()                
            }
        })
    } else {
        console.log('empty cookie')
        return res.status(404).json({ success: false, msg: 'token is unverify' })
    }
})

const logout = ((req, res, next) => {
    if(req.headers.access && req.headers.refresh) {
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
        return res.status(400).json({ success: false, msg: 'token is empty'})
    }
})

module.exports = {
    authenticate,
    logout
}