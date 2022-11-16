const express = require('express')
const cors = require('cors')
const cookieSession = require('cookie-session')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

const db = require('./models')

mongoose.connect(process.env.DATABASE_URL)
    .then(() => { console.log('Successfully connect to MongoDB.') })
    .catch(err => {
        console.error("Connection error", err)
        process.exit()
    })

require('./routes/auth.routes')(app)
require('./routes/user.router')(app)

var corsOptions = {
    origin: 'http://localhost:8000'
}



app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

app.use(
    cookieSession({
        name: 'online_shop-session',
        secret: process.env.COOKIE_SECRET,
        httpOnly: true
    })
)

// simple route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to online shop application' })
})

// set port, listen for requests
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on prot ${PORT}.`)
})