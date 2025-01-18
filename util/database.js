const mongodb = require('mongodb');         // mongodb 모듈
const MongoClient = mongodb.MongoClient;    // mongodb 클라이언트

let _db;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://aqua0405:ajtwlsrlxo1%40@cluster0.nvyhx.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
        .then(client => {
            console.log('Connected!');
            _db = client.db();              // 데이터베이스 연결
            callback();                     // 콜백 함수 호출
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;    // mongoConnect 함수 내보냄
exports.getDb = getDb;                  // getDb 함수 내보냄