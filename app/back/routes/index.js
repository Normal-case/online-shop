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
router.get('/wishList', authenticate, ctrl.output.wishList)
router.get('/order/:id', authenticate, ctrl.output.order)
router.get('/orderAll', authenticate, ctrl.output.orderAllList)
router.get('/order/list/:status', authenticate, ctrl.output.orderList)

router.post('/login', ctrl.process.login)
router.post('/register', ctrl.process.register)
router.post('/profile', authenticate, uploadProfile.single('img'), ctrl.process.profile)
router.post('/product', authenticate, uploadProduct.array('img', 10), ctrl.process.product)
router.post('/wishList', authenticate, ctrl.process.wishList)
router.post('/liked', authenticate, ctrl.process.liked)
router.post('/liked/get', authenticate, ctrl.process.likedGet)
router.post('/order', authenticate, ctrl.process.order)

router.put('/order', authenticate, ctrl.update.order)

router.delete('/liked', authenticate, ctrl.remove.liked)
router.delete('/wishList', authenticate, ctrl.remove.wishList)

module.exports = router