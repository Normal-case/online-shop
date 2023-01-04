const User = require("../models/User")

const output = {
    login: async (req, res) => {
        const user = new User({})
        const response = await user.accesstoken(req.headers.authorization)
        return res.json(response)
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