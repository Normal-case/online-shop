const express = require('express')
const router = express.Router()
const ctrl = require('./route.ctrl')
const { authenticate, logout } = require('../middleware/authenticate')
const { profileUploader, productUploader, reviewUploader } = require('../middleware/aws')

router.get('/user/auth', authenticate, ctrl.output.auth)
router.get('/user/logout', logout, ctrl.output.logout)
router.get('/user/profile', authenticate, ctrl.output.profile)
router.get('/product', ctrl.output.product)
router.get('/product/:id', ctrl.output.productDetail)
router.get('/wishList', authenticate, ctrl.output.wishList)
router.get('/order/:id', authenticate, ctrl.output.order)
router.get('/user/order', authenticate, ctrl.output.orderList)
router.get('/admin/order/list/:status', authenticate, ctrl.output.orderAllList) // admin
router.get('/review/:id', ctrl.output.review)

router.post('/login', ctrl.process.login)
router.post('/register', ctrl.process.register)
router.post('/profile', authenticate, profileUploader.single('img'), ctrl.process.profile) 
router.post('/product', authenticate, productUploader.array('img', 5), ctrl.process.product) // admin
router.post('/wishList', authenticate, ctrl.process.wishList)
router.post('/liked', authenticate, ctrl.process.liked)
router.post('/liked/get', authenticate, ctrl.process.likedGet)
router.post('/order', authenticate, ctrl.process.order)
router.post('/review', authenticate, reviewUploader.array('img', 4), ctrl.process.review) // admin

router.put('/order', authenticate, ctrl.update.order)
router.put('/admin/order/status', authenticate, ctrl.update.orderStatus) // admin
router.put('/review', authenticate, reviewUploader.array('img', 4), ctrl.update.review)
router.put('/product', authenticate, productUploader.array('img', 5), ctrl.update.product)

router.delete('/liked', authenticate, ctrl.remove.liked)
router.delete('/wishList', authenticate, ctrl.remove.wishList)
router.delete('/review', authenticate, ctrl.remove.review)

module.exports = router