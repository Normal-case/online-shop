var { MongoClient } = require('mongodb')
const readline = require('readline')
require('dotenv').config({ path: __dirname + '/../.env'})
var connectionString = process.env.MONGODB_URI
const client = new MongoClient(connectionString)

client.connect((err, db) => {
    if(err) throw err

    dbo = db.db('onlineShop')
    console.log('Successfully connected to MongoDB test')

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    console.log('please choose options')
    console.log('1. delete all users and profiles')
    console.log('2. update user authority. Plz input username with spacebar')
    rl.on('line', async (line) => {
        const inputLine = line.split(' ')
        var option, data
        if(inputLine.length === 1) {
            option = Number(inputLine[0])
        } else if(inputLine.length === 2) {
            option = Number(inputLine[0])
            data = inputLine[1]
        } else {
            console.log('wrong input')
            return
        }
        
        if(option) {
            if(option === 1) {
                await dbo.collection('user').deleteMany({})
                await dbo.collection('profile').deleteMany({})
                await dbo.collection('refresh').deleteMany({})
                console.log('success delete all users and profiles')
            } else if (option === 2) {
                await dbo.collection('user').update(
                    { username: data },
                    { $set: { authority: 'manager' } },
                    { upsert: true }
                )
                await dbo.collection('profile').update(
                    { username: data },
                    { $set: { authority: 'manager' } },
                    { upsert: true }
                )
                console.log('success update')
            } else if (option === 3) {
                // other options
            } else {
                console.log(`input is wrong`)
            }
        } else {
            console.log(`input is wrong`)
        }
        rl.close()
    })

    rl.on('close', () => {
        process.exit()
    })
})