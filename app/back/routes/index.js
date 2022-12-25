const express = require('express')
const router = express.Router()

router.post('/login', (req, res) => {
    console.log(req.body)
    return res.json(req.body)
})

module.exports = router