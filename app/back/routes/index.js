const express = require('express')
const router = express.Router()
const dbo = require('../bin/db/connect')
const ctrl = require('./route.ctrl')

router.post('/login', ctrl.process.login)

module.exports = router