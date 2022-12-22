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

// middleware
app.use(bodyParser.json())
app.use(cors(corsOption))

app.post('/login', (req, res) => {
    console.log(req.body)
    return res.json(req.body)
})

app.listen(PORT, () => {
    console.log(`Express server on ${PORT}`)
})
