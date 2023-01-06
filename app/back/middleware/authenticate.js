const jwt = require('jsonwebtoken')

const authenticate = ((req, res, next) => {
    if(req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.ACCESSTOKEN_SECRET, (err) => {
            if (err) {
                res.status(401).json({ error: 'Auth Error from authenticate' })
            } else {
                next()
            }
        })
    } else {
        res.status(401).json({ error: 'Auth Error from authenticate' })
    }
})

module.exports = {
    authenticate
}