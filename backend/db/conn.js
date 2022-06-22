require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const dbUrl = process.env.DB_URL;

const client = new MongoClient(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

let dbConnection;

module.exports = {
    connectToServer: function(callback) {
        client.connect(function (err, db) {
            if (err || !db) {
                return callback(err);
            }
            
            dbConnection = db.db('marketplace_db');
            console.log('Connected to MongoDB');

        return callback();
        });
    },
    getDB: function() {
        return dbConnection;
    }
};