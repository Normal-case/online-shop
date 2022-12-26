const { MongoClient } = require("mongodb")
const connectionString = process.env.MONGODB_URI
const client = new MongoClient(connectionString)

let dbConnection

module.exports = {
    connectToServer: () => {
        client.connect((error, db) => {
            if(error || !db) {
                return console.log(error)
            }

            dbConnection = db.db('onlineShop')
            console.log("Successfully connected to MongoDB")
        })
    },

    getDB: () => { return dbConnection }
}