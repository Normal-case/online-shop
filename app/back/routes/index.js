const express = require('express')
const router = express.Router()
const ctrl = require('./route.ctrl')
const multer = require('multer')
const upload = multer({ dest: 'files/profile/'})
const { authenticate, refreshAuth, logout } = require('../middleware/authenticate')

router.get('/user/auth', authenticate, ctrl.output.auth)
router.get('/user/auth/refresh', refreshAuth, ctrl.output.refresh)
router.get('/user/logout', logout, ctrl.output.logout)
router.get('/user/profile', ctrl.output.profile)

router.post('/login', ctrl.process.login)
router.post('/register', ctrl.process.register)
router.post('/profile', upload.single('img'), ctrl.process.profile)

module.exports = router