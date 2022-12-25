// module
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const PORT = 8000
const app = express()

const whitelist = ["http://localhost:3000"]
const corsOption = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

// routing
const route = require('./routes')

// middleware
app.use(bodyParser.json())
app.use(cors(corsOption))
app.use('/', route)

app.listen(PORT, () => {
    console.log(`Express server on ${PORT}`)
})
