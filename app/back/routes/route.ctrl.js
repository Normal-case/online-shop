const User = require("../models/User")
const UserStorage = require('../models/UserStorage')
const Product = require('../models/Product')
const ProductStorage = require('../models/ProductStorage')
const WishList = require('../models/wishList')
const Liked = require('../models/Liked')
const LikedStorage = require('../models/LikedStorage')
const Token = require('../bin/jwt/token')
const fs = require('fs')

const output = {
    auth: async (req, res) => {
        const response = { success: true }
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
        const product = await ProductStorage.getProduct()
        const response = { success: true, product: product }
        return res.status(200).json(response)
    },

    productDetail: async (req, res) => {
        const product = await ProductStorage.getProductDetail(req.params.id)
        const response = { success: true, product: product }
        return res.status(200).json(response)
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
        if(req.file) {
            // file rename
            fs.rename(req.file.path, 'files/profile/' + profile.username + 'Profile.jpg', (err) => {
                if(err) throw err
            })
        }

        return res.status(200)
    },

    product: async (req, res) => {
        // product change
        if(!req.isAdmin) return res.status(400).json({ success: false })
        const body = req.body
        const username = req.user.name
        const product = new Product()
        const id = await product.create(req.files, body, username)

        if(req.files) {
            for(var i=0;i<req.files.length;i++) {
                fs.rename(req.files[i].path, `files/product/${id}_${i}.jpg`, (err) => {if(err) throw err})
            }
        }

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
    }
}

const remove = {
    liked: (req, res) => {
        console.log(req.body)
        return res.status(200).json({ success: true })
    }
}

module.exports = {
    output,
    process,
    remove
}