const express = require('express')
const router = express.Router()
const ctrl = require('./route.ctrl')
const {authenticate} = require('../middleware/authenticate')

router.get('/user/auth', authenticate, ctrl.output.auth)
//router.get('/user/auth/refresh', ctrl.output.refresh)
router.post('/login', ctrl.process.login)
router.post('/register', ctrl.process.register)

module.exports = router