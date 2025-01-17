const Sequelize = require('sequelize');

// 데이터베이스 연결
const sequelize = new Sequelize('nodejs_basic', 'root', '1234', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;