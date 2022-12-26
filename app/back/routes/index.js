const express = require('express')
const router = express.Router()
const dbo = require('../bin/db/connect')
dbo.connectToServer()

router.post('/login', (req, res) => {
    console.log(req.body)
    const dbConnect = dbo.getDB()
    dbConnect.collection('user').findOne({ username: 'chan' }, (error, result) => {
        console.log(result)
    })
    return res.json(req.body)
})

module.exports = router