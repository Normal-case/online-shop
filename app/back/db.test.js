var { MongoClient } = require('mongodb')
const readline = require('readline')
require('dotenv').config({ path: __dirname + '/../.env'})
var connectionString = process.env.MONGODB_URI
const client = new MongoClient(connectionString)
const fs = require('fs')

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
    console.log('3. clear product and product image')
    console.log('4. clear order and order detail')
    console.log('5. clear review and productUser')
    console.log('6. clear wishList and liked')
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
                await dbo.collection('product').deleteMany({})
                await dbo.collection('productImage').deleteMany({})
                fs.readdirSync('./files/product/').forEach(file => {
                    fs.unlinkSync(`./files/product/${file}`)
                })
                console.log('success delete product and product image')
            } else if (option === 4) {
                await dbo.collection('order').deleteMany({})
                await dbo.collection('orderDetail').deleteMany({})
                console.log('success delete order and orderDetail')
            } else if (option === 5) {
                await dbo.collection('review').deleteMany({})
                await dbo.collection('productUser').deleteMany({})
                console.log('success delete review and productUser')
            } else if (option === 6) {
                await dbo.collection('wishList').deleteMany({})
                await dbo.collection('liked').deleteMany({})
                console.log('success delete wishList and liked')
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