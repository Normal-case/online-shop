const express = require('express')
const router = express.Router()
const ctrl = require('./route.ctrl')
const multer = require('multer')
const uploadProfile = multer({ dest: 'files/profile/'})
const uploadProduct = multer({ dest: 'files/product/'})
const { authenticate, logout } = require('../middleware/authenticate')

router.get('/user/auth', authenticate, ctrl.output.auth)
router.get('/user/logout', logout, ctrl.output.logout)
router.get('/user/profile', authenticate, ctrl.output.profile)
router.get('/product', ctrl.output.product)
router.get('/product/:id', ctrl.output.productDetail)


router.post('/login', ctrl.process.login)
router.post('/register', ctrl.process.register)
router.post('/profile', authenticate, uploadProfile.single('img'), ctrl.process.profile)
router.post('/product', authenticate, uploadProduct.array('img', 10), ctrl.process.product)
router.post('/wishList', authenticate, ctrl.process.wishList)
router.post('/liked', authenticate, ctrl.process.liked)
router.post('/liked/get', authenticate, ctrl.process.likedGet)

module.exports = router