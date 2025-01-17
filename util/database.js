const mongodb = require('mongodb');         // mongodb 모듈
const MongoClient = mongodb.MongoClient;    // mongodb 클라이언트

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://aqua0405:password@cluster0.nvyhx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        .then(client => {
            console.log('Connected!');
            callback(client);
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports = mongoConnect;