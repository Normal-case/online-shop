const User = require("../models/User")
const UserStorage = require('../models/UserStorage')
const Product = require('../models/Product')
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
        //const user = new User(req.headers.user)
        var AToken
        if(req.access) {
            AToken = req.access
        }
        const profile = await UserStorage.profileGet(req.headers.user)
        const response = { success: true, profile: profile, accesstoken: AToken }
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

    product: (req, res) => {
        // product change
        //console.log(req.files)
        const body = req.body
        const product = new Product()
        product.create(req.files, body)

        if(req.files) {
            for(var i=0;i<req.files.length;i++) {
                fs.rename(req.files[i].path, `files/product/${body.productName}_${i}.jpg`, (err) => {if(err) throw err})

                // fs.rename(req.files[i].path, 'files/product/' + body.productName + '_' + i + '.jpg', (err) => {if(err) throw err})
            }
        }

        return res.status(200).json({ success: true })
    }
}

module.exports = {
    output,
    process
}