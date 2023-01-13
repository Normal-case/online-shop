const User = require("../models/User")

const output = {
    auth: async (req, res) => {
        // const user = new User({})
        // const response = await user.accesstoken(req.headers.authorization)
        const response = { success: true }
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
    }
}

module.exports = {
    output,
    process
}