const dbo = require('../bin/db/connect')
const User = require("../models/User")
const UserStorage = require('../models/UserStorage')
const Product = require('../models/Product')
const ProductStorage = require('../models/ProductStorage')
const WishList = require('../models/WishList')
const WishListStorage = require('../models/WishListStorage')
const Liked = require('../models/Liked')
const LikedStorage = require('../models/LikedStorage')
const Order = require('../models/Order')
const OrderStorage = require('../models/OrderStorage')
const Review = require('../models/Review')
const Token = require('../bin/jwt/token')
const fs = require('fs')
const ReviewStorage = require("../models/ReviewStorage")
const { ObjectId } = require('mongodb')

const output = {
    auth: async (req, res) => {
        const response = { success: true, admin: req.isAdmin }
        return res.status(200).json(response)
    },

    refresh: async (req, res) => {
        const AToken = Token.manager.generateToken({ username: req.username }, true)
        const response = { success: true, accesstoken: AToken }
        return res.status(200).json(response)
    },

    logout: (req, res) => {
        const response = { success: true }
        return res.status(200).json(response)
    },

    profile: async (req, res) => {
        var AToken
        if(req.access) {
            AToken = req.access
        }
        const profile = await UserStorage.profileGet(req.headers.user)
        const response = { success: true, profile: profile, accesstoken: AToken }
        return res.status(200).json(response)
    },

    product: async (req, res) => {
        const product = await ProductStorage.getProduct(req.headers.filter)
        const response = { success: true, product: product }
        return res.status(200).json(response)
    },

    productDetail: async (req, res) => {
        const product = await ProductStorage.getProductDetail(req.params.id)
        const response = { success: true, product: product }
        return res.status(200).json(response)
    },

    wishList: async (req, res) => {
        const { wishList, likedList } = await WishListStorage.getList(req.user.username)
        const response = { success: true, wishList, likedList }
        return res.status(200).json(response)
    },

    order: async (req, res) => {
        const data = await OrderStorage.getOrder(req.params.id)
        var response
        if(data.load) response = { success: true, data }
        else response = {success: false}

        return res.status(200).json(response)
    },

    orderAllList: async (req, res) => {
        const orderArr = await OrderStorage.getOrderAllList(req.params.status)
        const response = { success: true, order: orderArr }
        return res.status(200).json(response)
    },

    orderList: async (req, res) => {
        const order = await OrderStorage.getOrderList(req.user.username)
        const response = { success: true, order }
        return res.status(200).json(response)
    },

    review: async (req, res) => {
        const review = await ReviewStorage.getReview(req.params.id)
        return res.status(200).json({ success: true, review })
    }
}

const process = {
    login: async (req, res) => {
        const user = new User(req.body)
        const response = await user.login()
        return res.json(response)
    },

    register: async (req, res) => {
        const user = new User(req.body)
        const response = await user.register()
        return res.json(response)
    },

    profile: async (req, res) => {
        const profile = await UserStorage.profileUpdate(req.file, req.body)
        // if(req.file) {
        //     // file rename
        //     fs.rename(req.file.path, 'files/profile/' + profile.username + 'Profile.jpg', (err) => {
        //         if(err) throw err
        //     })
        // }

        return res.status(200)
    },

    product: async (req, res) => {
        // product change
        if(!req.isAdmin) return res.status(400).json({ success: false })
        const product = new Product(req.body)
        const id = await product.create(req.files, req.user)

        // if(req.files) {
        //     for(var i=0;i<req.files.length;i++) {
        //         fs.rename(req.files[i].path, `files/product/${id}_${i}.jpg`, (err) => {if(err) throw err})
        //     }
        // }

        return res.status(200).json({ success: true })
    },

    wishList: (req, res) => {
        const wishlist = new WishList(req.body)
        wishlist.create()
        return res.status(200).json({ success: true })
    },

    liked: (req, res) => {
        const liked = new Liked(req.body)
        liked.create()
        return res.status(200).json({ success: true })
    },

    likedGet: async (req, res) => {
        const liked = await LikedStorage.getLiked(req.body)
        return res.status(200).json({ success: true, liked })
    },

    order: async (req, res) => {
        const order = new Order(req.body)
        const orderId = await order.create(req.user)
        return res.status(200).json({ success: true, orderId: orderId })
    },

    review: async (req, res) => {
        const review = new Review(req.body)
        const result = await review.create(req.files, req.user.username)
        
        if(result.success) {
            if(req.files) {
                for(let i=0;i<req.files.length;i++) {
                    fs.rename(req.files[i].path, `files/review/${result.id}_${i}.jpg`, (err) => {if(err) throw err})
                }
            }

            return res.status(200).json({ success: true })
        } else {
            if(req.files) {
                for(let i=0;i<req.files.length;i++) {
                    fs.unlink(req.files[i].path, err => {if(err) throw err})
                }
            }

            if(result.type === 'exist') {
                return res.status(400).json({ success: false, type: 'exist' })
            } else {
                return res.status(400).json({ success: false, type: 'buy' })
            }
        }
    }
}

const update = {
    order: (req, res) => {
        const order = new Order(req.body)
        const success = order.update()
        return res.status(200).json({ success: success })
    },

    orderStatus: (req, res) => {
        if(!req.isAdmin) return res.status(400).json({ success: false })
        const order = new Order(req.body)
        order.status()
        return res.status(200).json({ success: true })
    },

    product: async (req, res) => {
        if(!req.isAdmin) return res.status(400).json({ success: false })

        // 작성자가 아닐 경우
        const dbConnect = dbo.getDB()
        const tmpProduct = await dbConnect.collection('product').findOne({
            _id: ObjectId(req.body.id)
        })

        if(tmpProduct.postedUsername !== req.user.username) {
            return res.status(400).json({ success: false, type: 'authority' })
        }
        const product = new Product(req.body)
        await product.update(req.files)

        // if(req.files) {
        //     for(let i=0;i<req.files.length;i++) {
        //         fs.rename(
        //             req.files[i].path, `files/product/${req.body.id}_${i}.jpg`, (err) => {if(err) throw err}
        //         )
        //     }
        // }
        return res.status(200).json({ success: true })
    },

    review: async (req, res) => {
        const review = new Review(req.body)
        const result = await review.update(req.files, req.user.username)

        if(result.success) {
            if(req.files) {
                for(let i=0;i<req.files.length;i++) {
                    fs.rename(req.files[i].path, `files/review/${req.body.reviewId}_${i}.jpg`, (err) => {if(err) throw err})
                }
            }

            return res.status(200).json({ success: true })
        } else {
            if(req.files) {
                for(let i=0;i<req.files.length;i++) {
                    fs.unlink(req.files[i].path, err => {if(err) throw err})
                }
            }

            return res.status(400).json({ success: false, type: 'exist' })
        }
    }
}

const remove = {
    liked: (req, res) => {
        const liked = new Liked(req.body)
        liked.delete()
        return res.status(200).json({ success: true })
    },

    wishList: (req, res) => {
        const wishList = new WishList(req.body)
        wishList.delete()
        return res.status(200).json({ success: true })
    },

    review: (req, res) => {
        const review = new Review(req.body)
        review.delete(req.user.username)
        return res.status(200).json({ success: true })
    }
}

module.exports = {
    output,
    process,
    remove,
    update
}