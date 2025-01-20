const mongoose = require('mongoose');       // 몽구스 모듈

const Schema = mongoose.Schema;             // 스키마 생성자

const productSchema = new Schema({          // 스키마 생성
    title: {                                // 상품명
        type: String,
        required: true
    },
    price: {                                // 가격
        type: Number,
        required: true
    },
    description: {                          // 상품 설명
        type: String,
        required: true
    },
    imageUrl: {                             // 이미지 URL
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);  // Product 모델 내보냄