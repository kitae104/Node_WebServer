const Sequelize = require('sequelize');         // 시퀄라이즈 패키지  
const sequelize = require('../util/database');  // 데이터베이스 모듈

// 상품 모델 정의
const Product = sequelize.define('product', {   
    id: {                           // 상품 ID
        type: Sequelize.INTEGER,    // 데이터 타입은 정수형
        autoIncrement: true,        // 자동 증가
        allowNull: false,           // 널 값 허용 안함
        primaryKey: true            // 기본 키
    },
    title: Sequelize.STRING,        // 상품명
    price: {                        // 상품 가격
        type: Sequelize.INTEGER,    // 데이터 타입은 정수형
        allowNull: false            // 널 값 허용 안함
    },
    imageUrl: {                     // 이미지 URL
        type: Sequelize.STRING,     // 데이터 타입은 문자열
        allowNull: false            // 널 값 허용 안함
    },
    description: {                  // 상품 설명
        type: Sequelize.STRING,     // 데이터 타입은 문자열
        allowNull: false            // 널 값 허용 안함
    }
});

module.exports = Product;    // 상품 모델을 내보냄