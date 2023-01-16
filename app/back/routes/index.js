const express = require('express')
const router = express.Router()
const ctrl = require('./route.ctrl')
const { authenticate, refreshAuth, logout } = require('../middleware/authenticate')

router.get('/user/auth', authenticate, ctrl.output.auth)
router.get('/user/auth/refresh', refreshAuth, ctrl.output.refresh)
router.get('/user/logout', logout, ctrl.output.logout)
router.post('/login', ctrl.process.login)
router.post('/register', ctrl.process.register)

module.exports = router