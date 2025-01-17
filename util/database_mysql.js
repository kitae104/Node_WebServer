const mysql = require('mysql2');

// 데이터베이스 연결
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'nodejs_basic',
    password: '1234'
});

module.exports = pool.promise();    // promise() 메소드를 사용하여 프로미스를 반환