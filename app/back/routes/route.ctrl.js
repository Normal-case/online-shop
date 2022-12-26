const User = require("../models/User")

const process = {
    login: async (req, res) => {
        const user = new User(req.body)
        const response = await user.login()
        return response
    }
}

module.exports = {
    process
}