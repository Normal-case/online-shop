const User = require("../models/User")
const UserStorage = require('../models/UserStorage')
const Token = require('../bin/jwt/token')
const fs = require('fs')
const { moveMessagePortToContext } = require("worker_threads")

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
        const profile = await UserStorage.profileGet(req.headers.user)
        const response = { success: true, profile: profile }
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
        const legacyImage = profile.pImage.split('/').slice(-1)
        if(req.file) {

            // file rename
            fs.rename(req.file.path, 'files/profile/' + req.file.filename + '.jpg', (err) => {
                if(err) console.log(err)
            })

            // remove legacy image file
            if(legacyImage[0] !== 'profile.png') {
                fs.unlinkSync('files/profile/' + legacyImage)
            }
            
        }

        return res.status(200)
    }
}

module.exports = {
    output,
    process
}