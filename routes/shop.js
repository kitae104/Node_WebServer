const express = require('express');
const path = require('path');

const productsController = require('../controllers/products'); // productsController 모듈 가져오기

const router = express.Router(); // Router 객체 생성

router.get('/', productsController.getProducts); // 상품 목록 페이지 라우팅

module.exports = router; // router 객체를 모듈로 내보냄
