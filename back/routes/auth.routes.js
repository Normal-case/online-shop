const verifySignUp = require('../middlewares/verifySignUp')
const controller = require('../controllers/auth.controller')

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Header',
            'Origin, Content-Type, Accept'
        )
        next()
    })

    app.post('/api/auth/signup', [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted
    ], controller.signup)

    app.post('/api/auth/signin', controller.signin)
    app.post('/api/auth/signout', controller.signout)
}