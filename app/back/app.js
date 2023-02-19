// module
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const formData = multer()
require('dotenv').config({ path: __dirname + '/../.env'})

// custom module
const dbo = require('./bin/db/connect')
dbo.connectToServer()

const PORT = process.env.PORT
const app = express()

const whitelist = [process.env.CLIENT_DOMAIN]
const corsOption = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

// routing
const route = require('./routes')

// middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
//app.use(formData.array())
app.use(cors(corsOption))
app.use(express.static('files'))
app.use('/', route)

app.listen(PORT, () => {
    console.log(`Express server on ${PORT}`)
})