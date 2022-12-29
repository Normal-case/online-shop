const User = require("../models/User")

const process = {
    login: async (req, res) => {
        const user = new User(req.body)
        const response = await user.login()
        return res.json(response)
    },

    register: (req, res) => {
        console.log(req.body)
        return res.send('get data')
    }
}

module.exports = {
    process
}