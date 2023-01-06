const express = require('express')
const router = express.Router()
const ctrl = require('./route.ctrl')
const {authenticate} = require('../middleware/authenticate')

router.get('/login', authenticate, ctrl.output.login)
router.post('/login', ctrl.process.login)
router.post('/register', ctrl.process.register)

module.exports = router