// module
const express = require('express')
const bodyParser = require('body-parser')

const PORT = 8000
const app = express()

// middleware
app.use(bodyParser.json())

app.post('/login', (req, res) => {
    console.log(req.body)
    return res.json(req.body)
})

app.listen(PORT, () => {
    console.log(`Express server on ${PORT}`)
})
