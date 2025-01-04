const express = require('express');
const path = require('path');

const adminController = require('../controllers/admin'); // adminController 모듈 가져오기

const router = express.Router(); // Router 객체 생성

router.get('/add-product', adminController.getAddProduct); 

router.get('/products', adminController.getProducts); // 상품 목록 페이지 라우팅

router.post('/add-product', adminController.postAddProduct);

module.exports = router; // Router 객체를 모듈로 내보냄
