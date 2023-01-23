const express = require('express')
const router = express.Router()
const querystring = require('querystring')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.serializeUser((user, done) => {
    console.log('serial')
    done(null, user)
})

passport.deserializeUser((user, done) => {
    console.log('deserial')
    done(null, user)
})

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8000/auth/google/callback",
            passReqToCallback: true
        },
        (req, AToken, RToken, profile, done) => {
            req.AToken = AToken
            req.RToken = RToken
            console.log(RToken)
            return done(null, profile)
        }
    )
)

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get('/auth/google/callback', passport.authenticate('google', {
    failureMessage: true,
    session: false
}), (req, res) => {
    // console.log(req.user)
    const query = querystring.stringify({"accesstoken": req.AToken})
    res.redirect('http://localhost:3000/?' + query)
})

module.exports = router